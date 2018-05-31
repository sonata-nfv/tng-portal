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
