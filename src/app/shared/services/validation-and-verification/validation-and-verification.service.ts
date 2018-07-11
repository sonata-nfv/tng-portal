import { Injectable } from "@angular/core";
import { ConfigService } from "../config/config.service";
import { AuthService } from "../auth/auth.service";

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";

@Injectable()
export class ValidationAndVerificationPlatformService {
  authHeaders: HttpHeaders;
  request_uuid: string;
  // pagination: string = "?page_size=20&page_number=1";

  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient
  ) {}

  /**
   * Retrieves a list of tests.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Test attributes that must be
   *                          matched by the returned list of
   *                          tests.
   */
  getTests(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined ? this.config.tests + search : this.config.tests;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          console.log(response);
          resolve(response);

          // if (response instanceof Array) {
          //   resolve(
          //     response.map(item => {
          //       return {
          //         uuid: item.uuid,
          //         name: item.pd.name,
          //         vendor: item.pd.vendor,
          //         version: item.pd.version,
          //         status: item.pd.version
          //       };
          //     })
          //   );
          // } else {
          //   reject();
          // }
        })
        .catch(err => reject(err.statusText));
    });
  }
}
