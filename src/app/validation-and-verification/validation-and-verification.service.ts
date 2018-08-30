import { Injectable } from "@angular/core";
import { ConfigService } from "../shared/services/config/config.service";
import { AuthService } from "../authentication/auth.service";

import { HttpClient, HttpHeaders } from "@angular/common/http";

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
        search != undefined
          ? this.config.baseVNV + this.config.tests + search
          : this.config.baseVNV + this.config.tests;

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
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseVNV + this.config.tests + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["testd"]["name"],
            vendor: response["testd"]["vendor"],
            version: response["testd"]["version"],
            // timesExecuted: response["testd"]
            timesExecuted: "20",
            author: response["testd"]["author"],
            description: response["testd"]["description"],
            createdAt: response["created_at"],
            status: response["status"],
            // lastTimeExecuted: response["testd"]
            lastTimeExecuted: "this is date",
            // services: response["testd"]
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
        })
        .catch(err => reject(err.statusText));
    });
  }

  getRslTest() {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
        this.http 
        .get(this.config.baseATH + this.config.testsResults, { headers: headers })   
        .toPromise()
        .then(response => { 
          resolve({
            // data: response
            data: "response"
          }); 
        })
        .catch(err => reject(err.statusText));
    });    
  }

  getRslTest2() {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
        this.http 
        .get(this.config.baseVNV + this.config.testsResults, { headers: headers })   
        .toPromise()
        .then(response => { 
          resolve({
            // data: response,
            "data": [
              {
                "test_uuid":"2c20cee4-1312-49b4-b8b2-e15ec5982646",
                "details": {
                  "graphs": [
                    { 
                        "data": {
                          "s1x":[ 0,1,2,3,4 ],
                          "s1y":[ 154, 230, 350, 1000, 3000 ],
                          "s2x":[ 1,2,3,4,5 ],
                          "s2y":[ 1000, 2000, 2500, 3230, 5000 ],
                        },
                        "title":"Http Benchmark test",
                        "type":"line",
                        "x-axis-title":"Iteration",
                        "x-axis-unit":"#",
                        "y-axis-title":"Requests per second",
                        "y-axis-unit":"rps"
                    },
                    { 
                      "data": { 
                        "s1x":[ 50, 75, 90, 99, 99.9, 99.99, 99.999, 100 ],
                        "s1y":[ 103547000, 148242000, 175243000, 190710000, 193069000, 194249000, 194773000, 194904000 ],
                        "s2x":[ 1 ],
                        "s2y":[ 2000 ],
                      },
                        "title":"Latency Distribution",
                        "type":"bar",
                        "x-axis-title":"Percentile",
                        "x-axis-unit":"Percentage",
                        "y-axis-unit":"Microseconds",
                        "y-axis-title":"Latency"
                    }
                  ],
              },
              },
              {
                "test_uuid":"2c20cee4-1312-49b4-b8b2-e15ec5982657",
                "details": {
                  "graphs": [
                    { 
                      "data": { 
                        "s1x":[1],
                        "s1y":[ 717.04 ],
                        "s2x":[ 1 ],
                        "s2y":[ 2000 ],
                        "title":"Http Benchmark test",
                        "type":"line",
                        "x-axis-title":"Iteration",
                        "x-axis-unit":"#",
                        "y-axis-title":"Requests per second",
                        "y-axis-unit":"rps"
                      }, 
                    },
                    { 
                      "data": { 
                        "s1x":[ 50, 75, 90, 99, 99.9, 99.99, 99.999, 100 ],
                        "s1y":[ 103547000, 148242000, 175243000, 190710000, 193069000, 194249000, 194773000, 194904000 ],
                        "s2x":[ 1 ],
                        "s2y":[ 2000 ],
                        "title":"Latency Distribution",
                        "type":"bar",
                        "x-axis-title":"Percentile",
                        "x-axis-unit":"Percentage",
                        "y-axis-unit":"Microseconds",
                        "y-axix-title":"Latency"
                      }, 
                    }
                  ],
                },
              }
            ],
          }); 
        })
        .catch(err => reject(err.statusText));
    });    
  }

  /**
   * Launches a test or the test's of a service by UUID
   *
   * @param type Type of tests being launched: a test itself [test]
   *                   or the tests related to a service [service]
   * @param uuid UUID of the desired Test or Service
   */
  postOneTest(type: string, uuid: string) {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      let data;
      if (type == "test") {
        data = {
          test_uuid: uuid
        };
      } else if (type == "service") {
        data = {
          service_uuid: uuid
        };
      } else {
        reject("There was an error while trying to execute the tests");
      }

      this.http
        .post(this.config.baseVNV + this.config.testExecutions, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(err => reject("There was an error executing the test!"));
    });
  }
}
