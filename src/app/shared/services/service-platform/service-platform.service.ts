import { Injectable } from "@angular/core";
import { ConfigService } from ".././config/config.service";
import { AuthService } from ".././auth/auth.service";

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { timeout } from "q";

@Injectable()
export class ServicePlatformService {
  authHeaders: HttpHeaders;
  request_uuid: string;
  // pagination: string = "?page_size=20&page_number=1";

  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient
  ) {}

  /**
   * Retrieves a list of Packages.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Packages attributes that must be
   *                          matched by the returned list of
   *                          packages.
   */
  getPackages(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.base + this.config.packages + search
          : this.config.base + this.config.packages;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => {
                return {
                  uuid: item.uuid,
                  name: item.pd.name,
                  vendor: item.pd.vendor,
                  createdAt: item.created_at,
                  version: item.pd.version,
                  type: "public"
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a Package by UUID
   *
   * @param uuid UUID of the desired Package.
   */
  getOnePackage(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.base + this.config.packages + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          let res = {
            uuid: response["uuid"],
            name: response["pd"]["name"],
            author: response["pd"]["maintainer"],
            createdAt: response["created_at"],
            vendor: response["pd"]["vendor"],
            version: response["pd"]["version"],
            type: "public",
            package_file_id: response["package_file_id"]
          };
          resolve(res);
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of SLA Templates.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Template attributes that must be
   *                          matched by the returned list of
   *                          SLA Templates.
   */
  getSLATemplates(search?): any {
    return new Promise((resolve, reject) => {
      // let headers = this.authService.getAuthHeaders();
      // let url =
      //   search != undefined
      //     ? this.config.base + this.config.sla + search
      //     : this.config.base + this.config.sla;
      // this.http
      //   .get(url, {
      //     headers: headers
      //   })
      //   .toPromise()
      //   .then(response => {
      //     if (response instanceof Array) {
      //       resolve(
      //         response.map(item => {
      //           return {
      //             uuid: item.uuid,
      //             name: item.slad.name,
      //             ns: item.slad.sla_template.ns.ns_name,
      //             expirationDate: item.slad.sla_template.valid_until,
      //             status: item.status
      //           };
      //         })
      //       );
      //     } else {
      //       reject();
      //     }
      //   })
      //   .catch(err => reject(err.statusText));
      setTimeout(() => {
        resolve([
          {
            status: "active",
            name: "sla1",
            uuid: "45217851155",
            ns: "ns1",
            expirationDate: "05/12/2019"
          }
        ]);
      }, 1000);
    });
  }
}
