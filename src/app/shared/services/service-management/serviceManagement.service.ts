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
  request_uuid: string;

  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient
  ) {}

  getNetworkServices(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.ROUTES.BASE + this.config.ROUTES.SERVICES, {
          headers: headers
        })
        .subscribe(
          response => {
            if (response instanceof Array) {
              this.getVimsRequestUUID();
              resolve(response);
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
              resolve(datacenters);
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

  getPackages(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(
          this.config.ROUTES.BASE +
            this.config.ROUTES.PACKAGES +
            this.config.PAGINATION,
          {
            headers: headers
          }
        )
        .subscribe(
          response => {
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
              throw new Error("Response is not an array of Objects");
            }
          },
          (error: HttpErrorResponse) => {
            reject(error.statusText);
          }
        );
    });
  }

  getPackage(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(
          this.config.ROUTES.BASE + this.config.ROUTES.PACKAGES + "/" + uuid,
          {
            headers: headers
          }
        )
        .subscribe(
          response => {
            // TODO split package content into ns, vnf and tests
            // TODO request Jose name, version and vendor in packages content
            let res = {
              uuid: response["uuid"],
              name: response["pd"]["name"],
              author: response["pd"]["maintainer"],
              date: response["created_at"],
              vendor: response["pd"]["vendor"],
              version: response["pd"]["version"],
              type: "public",
              ns: response["pd"]["package_content"],
              vnf: response["pd"]["package_content"],
              tests: response["pd"]["package_content"]
            };
            resolve(res);
          },
          (error: HttpErrorResponse) => {
            reject(error.statusText);
          }
        );
    });
  }
}
