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
          ? this.config.base + this.config.requests + search
          : this.config.base + this.config.requests;

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
                serviceId: item.uuid,
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
        .get(this.config.base + this.config.requests + "/" + uuid, {
          headers: headers
        })
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
      // let headers = this.authService.getAuthHeaders();
      // let url =
      //   search != undefined
      //     ? this.config.base + this.config.instances + search
      //     : this.config.base + this.config.instances;

      // this.http
      //   .get(url, {
      //     headers: headers
      //   })
      //   .toPromise()
      //   .then(response => {
      //     if (response instanceof Array) {
      //       resolve(
      //         response.map(item => ({
      //           instanceID: item.uuid,
      //           status: item.status,
      //           serviceID: item.descriptor_reference,
      //           version: item.version,
      //           latestVersion: ""
      //         }))
      //       );
      //     } else {
      //       reject();
      //     }
      //   })
      //   .catch(
      //     err => (err.status === 404 ? resolve([]) : reject(err.statusText))
      //   );

      setTimeout(() => {
        resolve([
          {
            instanceID: "1233-9564-88558-ab55",
            type: "public",
            createdAt: new Date().toISOString(),
            serviceID: "872135-32145-123465",
            status: "active",
            version: "0.4",
            latestVersion: "0.1"
          }
        ]);
      }, 1000);
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
    serviceUUID: Object,
    ingress: Array<Object>,
    egress: Array<Object>,
    slaUUID: string
  ) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      let data = {
        sla_id: slaUUID,
        uuid: serviceUUID,
        ingresses: ingress,
        egresses: egress
      };

      this.http
        .post(this.config.base + this.config.requests, data, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          console.log(response);
          resolve();
        })
        .catch(err => reject(err.statusText));
      // Show pop up saying success/error with id xxxxx
    });
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
