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

  constructor(private authService: AuthService, private config: ConfigService, private http: HttpClient) {}

  getNetworkServices(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      headers.set("Content-Type", "application/json");

      this.http
        .get(this.config.ROUTES.BASE + this.config.ROUTES.SERVICES, {
          headers: headers
        }).subscribe(response => {
            if (response[0].hasOwnProperty('nsd')) {
              resolve(response);
            }
            reject();
          },
          (error: HttpErrorResponse) => {
            reject(error.error.error.message);
          }
        );
    });
  }

}