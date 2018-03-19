import { Injectable } from "@angular/core";
import { ConfigService } from ".././config/config.service";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";

@Injectable()
export class ServiceManagementService {
  authHeaders: HttpHeaders;

  constructor(private config: ConfigService, private http: HttpClient) {}

  getNetworkServices(): any {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.set("Content-Type", "application/json");

      this.http
        .get(this.config.ROUTES.BASE + this.config.ROUTES.SERVICES, {
          headers: headers
        }).subscribe(response => {
            resolve(response);
          },
          (error: HttpErrorResponse) => {
            reject(error.error.error.message);
          }
        );
    });
  }
  
}