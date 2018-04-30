import { Injectable } from "@angular/core";
import { ConfigService } from ".././config/config.service";
import { AuthService } from ".././auth/auth.service";

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";

@Injectable()
export class ServiceManagementService {
  authHeaders: HttpHeaders;

  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient
  ) {}

  getNetworkServices(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      headers.set("Content-Type", "application/json");

      this.http
        .get(this.config.ROUTES.BASE + this.config.ROUTES.SERVICES, {
          headers: headers
        })
        .subscribe(
          response => {
            if (response[0].hasOwnProperty("nsd")) {
              resolve(response);
            } else {
              resolve([]);
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
        .get(this.config.ROUTES.BASE + this.config.ROUTES.SERVICES + uuid, {
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
        .get(this.config.ROUTES.BASE + this.config.ROUTES.REQUESTS, {
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
        .get(this.config.ROUTES.BASE + this.config.ROUTES.LICENCES, {
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
        .get(this.config.ROUTES.BASE + this.config.ROUTES.INSTANCES, {
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

  getPackages(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.ROUTES.BASE + this.config.ROUTES.PACKAGES, {
          headers: headers
        })
        .subscribe(
          response => {
            // TODO parse response
            resolve(response);
          },
          (error: HttpErrorResponse) => {
            reject(error.statusText);
          }
        );
    });
  }
}
