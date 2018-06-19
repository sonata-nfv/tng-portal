import { Injectable } from "@angular/core";
import { ConfigService } from ".././config/config.service";
import { AuthService } from ".././auth/auth.service";

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";

@Injectable()
export class CommonService {
  authHeaders: HttpHeaders;
  request_uuid: string;

  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient
  ) {}

  /**
   * Retrieves a list of Available Network Services.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Network Service attributes that
   *                          must be matched by the returned
   *                          list of NS.
   */
  getNetworkServices(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.base + this.config.services + search
          : this.config.base + this.config.services;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            this.getVimsRequestUUID();

            resolve(
              response.map(item => ({
                serviceName: item.nsd.name,
                serviceId: item.uuid,
                vendor: item.nsd.vendor,
                version: item.nsd.version,
                status: item.status,
                licenses: "None",
                slas: "/service-management/sm-network-services"
              }))
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a Network Service by UUID
   *
   * @param uuid UUID of the desired Network Service.
   */
  getOneNetworkService(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.base + this.config.services + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response.hasOwnProperty("nsd")) {
            resolve({
              name: response["nsd"]["name"],
              author: response["nsd"]["author"],
              version: response["nsd"]["version"],
              status: response["status"],
              vendor: response["nsd"]["vendor"],
              serviceID: response["uuid"],
              type: response["user_licence"],
              description: response["nsd"]["description"],
              createdAt: response["created_at"],
              updatedAt: response["updated_at"]
            });
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Initiates the server side process to recover existing vims
   *
   * @param request_uuid Identifier to request the vims later
   */
  getVimsRequestUUID(): any {
    let headers = this.authService.getAuthHeaders();
    this.http
      .get("https://sp.int3.sonata-nfv.eu/api/v2/vims", {
        headers: headers
      })
      .subscribe(
        response => {
          if (response instanceof Object) {
            this.request_uuid = response["items"]["request_uuid"];
          }
        },
        (error: HttpErrorResponse) => {}
      );
  }

  /**
   * Retrieves the existing vims represented by the city name
   */
  requestVims(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      if (this.request_uuid === undefined) {
        resolve(["None"]);
      }
      this.http
        .get("https://sp.int3.sonata-nfv.eu/api/v2/vims/" + this.request_uuid, {
          headers: headers
        })
        .subscribe(
          response => {
            if (response instanceof Array) {
              let datacenters = response.map(a => a.vim_city);
              if (datacenters.length == 0) {
                resolve(["None"]);
              } else {
                resolve(datacenters);
              }
            } else {
              throw new Error("Response is not an array of Objects");
            }
          },
          (error: HttpErrorResponse) => {
            reject(error.statusText);
          }
        );
    });
  }
}
