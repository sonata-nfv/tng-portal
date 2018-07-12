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
          if (response instanceof Array) {
            resolve(
              response.map(item => {
                return {
                  uuid: item.uuid,
                  name: item.testd.name,
                  vendor: item.testd.vendor,
                  version: item.testd.version,
                  status: item.status
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a Test by UUID
   *
   * @param uuid UUID of the desired Test.
   */
  getOneTest(uuid: string) {
    return new Promise((resolve, reject) => {
      //   let headers = this.authService.getAuthHeaders();

      //   this.http
      //     .get(this.config.testsDetail + "/" + uuid, {
      //       headers: headers
      //     })
      //     .toPromise()
      //     .then(response => {
      //       resolve({
      //         uuid: response["uuid"],
      //         name: response["name"],
      //         vendor: response["vendor"],
      //         version: response["version"]
      // timesExecuted:
      // author:
      // createdAt:
      // status:
      // lastTimeExecuted:
      // services:
      //       });
      //     })
      //     .catch(err => reject(err.statusText));
      // });

      setTimeout(() => {
        resolve({
          name: "test1",
          vendor: "5gtango",
          version: "0.4",
          timesExecuted: "20",
          author: "author",
          createdAt: "date",
          status: "status",
          lastTimeExecuted: "this is date",
          services: [
            {
              sVendor: "svendor",
              sName: "sname",
              sVersion: "0.3"
            },
            {
              sVendor: "svendor2",
              sName: "sname2",
              sVersion: "0.2"
            }
          ]
        });
      }, 1000);
    });
  }
}
