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
        .subscribe(
          response => {
            if (response instanceof Array) {
              this.commonService.getVimsRequestUUID();

              let res = response.map(function(item) {
                return {
                  serviceName: item.nsd.name,
                  serviceId: item.uuid,
                  vendor: item.nsd.vendor,
                  version: item.nsd.version,
                  type: "public",
                  licenses: "None",
                  slas: "/service-management/available-network-services"
                };
              });
              resolve(res);
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

  getNetworkService(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.base + this.config.services + "/" + uuid, {
          headers: headers
        })
        .subscribe(
          response => {
            if (response.hasOwnProperty("nsd")) {
              resolve(response);
            } else {
              resolve({});
            }
          },
          (error: HttpErrorResponse) => {
            reject(error.statusText);
          }
        );
    });
  }

  getRequests(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.base + this.config.requests, {
          headers: headers
        })
        .subscribe(
          response => {
            resolve(response);
          },
          (error: HttpErrorResponse) => {
            reject(error.statusText);
          }
        );
    });
  }

  getLicences(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.base + this.config.licences, {
          headers: headers
        })
        .subscribe(
          response => {
            resolve(response);
          },
          (error: HttpErrorResponse) => {
            reject(error.statusText);
          }
        );
    });
  }

  getInstances(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.base + this.config.instances, {
          headers: headers
        })
        .subscribe(
          response => {
            resolve(response);
          },
          (error: HttpErrorResponse) => {
            if (error.status === 404) {
              resolve([]);
            } else {
              reject(error.statusText);
            }
          }
        );
    });
  }

  instantiate(service: Object, ingress: Array<Object>, egress: Array<Object>) {
    console.log(ingress);
    console.log(egress);
    // Send request to instantiate with data
    // Show pop up saying success/error with id xxxxx
  }
}
