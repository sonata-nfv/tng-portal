import { Injectable } from "@angular/core";
import { ConfigService } from ".././config/config.service";
import { AuthService } from ".././auth/auth.service";

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";

@Injectable()
export class ServicePlatformService {
  authHeaders: HttpHeaders;
  request_uuid: string;
  pagination: string = "?page_size=20&page_number=1";

  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient
  ) {}

  getPackages(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.base + this.config.packages + this.pagination, {
          headers: headers
        })
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
        .get(this.config.base + this.config.packages + "/" + uuid, {
          headers: headers
        })
        .subscribe(
          response => {
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
          },
          (error: HttpErrorResponse) => {
            reject(error.statusText);
          }
        );
    });
  }
}
