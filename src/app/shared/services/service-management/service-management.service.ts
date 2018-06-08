import { Injectable } from "@angular/core";
import { ConfigService } from ".././config/config.service";
import { AuthService } from ".././auth/auth.service";
import { CommonService } from ".././common/common.service";

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";

@Injectable()
export class ServiceManagementService {
  authHeaders: HttpHeaders;
  request_uuid: string;

  constructor(
    private commonService: CommonService,
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
            this.commonService.getVimsRequestUUID();

            resolve(
              response.map(item => ({
                serviceName: item.nsd.name,
                serviceId: item.uuid,
                vendor: item.nsd.vendor,
                version: item.nsd.version,
                type: "public",
                licenses: "None",
                slas: "/service-management/available-network-services"
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
              vendor: response["nsd"]["vendor"],
              serviceID: response["uuid"],
              type: response["user_licence"],
              description: response["nsd"]["description"],
              createdAt: response["created_at"]
            });
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of Network Service requests.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Request attributes that must be
   *                          matched by the returned list of
   *                          NS requests.
   */
  getNSRequests(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.base +
            this.config.requests +
            "/" +
            this.config.services +
            search
          : this.config.base +
            this.config.requests +
            "/" +
            this.config.services;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => ({
                requestId: item.id,
                type: item.request_type,
                createdAt: item.created_at,
                serviceId: item.service_uuid,
                status: item.status
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
   * Retrieves a Network Service request by UUID
   *
   * @param uuid UUID of the desired NS request.
   */
  getOneNSRequest(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(
          this.config.base +
            this.config.requests +
            "/" +
            this.config.services +
            "/" +
            uuid,
          {
            headers: headers
          }
        )
        .toPromise()
        .then(response => {
          if (response.hasOwnProperty("id")) {
            resolve({
              requestID: response["id"],
              type: response["request_type"],
              createdAt: response["created_at"],
              updatedAt: response["updated_at"],
              serviceID: response["service_uuid"],
              status: response["status"]
            });
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of Network Service instances.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Instance attributes that must be
   *                          matched by the returned list of
   *                          NS instances.
   */
  getNSInstances(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.base + this.config.instances + search
          : this.config.base + this.config.instances;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => ({
                searchField: item.uuid,
                instanceID: item.uuid,
                status: item.status,
                serviceID: item.descriptor_reference,
                version: item.version,
                latestVersion: ""
              }))
            );
          } else {
            reject();
          }
        })
        .catch(
          err => (err.status === 404 ? resolve([]) : reject(err.statusText))
        );
    });
  }

  /**
   *
   * @param service Information about the service about to be instantiated
   * @param ingress Ingress points of the instantiation
   * @param egress Egress points of the instantiation
   * @param sla Selected service level agreement in the instantiation
   */
  postNSRequest(
    service: Object,
    ingress: Array<Object>,
    egress: Array<Object>,
    sla: string
  ) {
    console.log(ingress);
    console.log(egress);
    console.log(service);
    console.log(sla);
    // Send request to instantiate with data
    // Show pop up saying success/error with id xxxxx
  }

  getLicences(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.base + this.config.licences, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(err => reject(err.statusText));
    });
  }
}
