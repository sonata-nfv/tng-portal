import { Injectable } from "@angular/core";
import { ConfigService } from ".././config/config.service";
import { AuthService } from ".././auth/auth.service";

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { timeout } from "q";

@Injectable()
export class ServicePlatformService {
  authHeaders: HttpHeaders;
  request_uuid: string;
  // pagination: string = "?page_size=20&page_number=1";

  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient
  ) {}

  /**
   * Retrieves a list of Packages.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Packages attributes that must be
   *                          matched by the returned list of
   *                          packages.
   */
  getPackages(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.base + this.config.packages + search
          : this.config.base + this.config.packages;

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
                  name: item.pd.name,
                  vendor: item.pd.vendor,
                  createdAt: item.created_at,
                  version: item.pd.version,
                  type: "public"
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
   * Retrieves a Package by UUID
   *
   * @param uuid UUID of the desired Package.
   */
  getOnePackage(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.base + this.config.packages + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["pd"]["name"],
            author: response["pd"]["maintainer"],
            createdAt: response["created_at"],
            vendor: response["pd"]["vendor"],
            version: response["pd"]["version"],
            type: "public",
            package_file_id: response["package_file_id"]
          });
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of Functions.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Packages attributes that must be
   *                          matched by the returned list of
   *                          packages.
   */
  getFunctions(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.base + this.config.functions + search
          : this.config.base + this.config.functions;

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
                  name: item.vnfd.name,
                  vendor: item.vnfd.vendor,
                  status: item.status,
                  version: item.vnfd.version,
                  type: "public"
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
   * Retrieves a Function by UUID
   *
   * @param uuid UUID of the desired Function.
   */
  getOneFunction(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.base + this.config.functions + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["vnfd"]["name"],
            author: response["vnfd"]["author"],
            createdAt: response["created_at"],
            updatedAt: response["updated_at"],
            vendor: response["vnfd"]["vendor"],
            version: response["vnfd"]["version"],
            type: "public",
            status: response["status"],
            description: response["vnfd"]["description"]
          });
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of SLA Templates.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Template attributes that must be
   *                          matched by the returned list of
   *                          SLA Templates.
   */
  getSLATemplates(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.base + this.config.templates + search
          : this.config.base + this.config.templates;
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
                  name: item.slad.name,
                  ns: item.slad.sla_template.ns.ns_name,
                  expirationDate: item.slad.sla_template.valid_until,
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
   * Retrieves a SLA Template by UUID
   *
   * @param uuid UUID of the desired SLA Template.
   */
  getOneSLATemplate(uuid): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.base + this.config.templates + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["slad"]["name"],
            author: response["slad"]["author"],
            createdAt: response["created_at"],
            expirationDate: new Date(
              Date.parse(response["slad"]["sla_template"]["valid_until"])
            ),
            ns: response["slad"]["sla_template"]["ns"]["ns_name"],
            storedGuarantees:
              response["slad"]["sla_template"]["ns"]["guaranteeTerms"]
          });
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of SLA Agreements.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Agreement attributes that must be
   *                          matched by the returned list of
   *                          SLA Agreements.
   */
  getSLAAgreements(search?): any {
    return new Promise((resolve, reject) => {
      // let headers = this.authService.getAuthHeaders();
      // let url =
      //   search != undefined
      //     ? this.config.base + this.config.agreements + search
      //     : this.config.base + this.config.agreements;
      // this.http
      //   .get(url, {
      //     headers: headers
      //   })
      //   .toPromise()
      //   .then(response => {
      //     resolve(
      //       response["cust_sla"].map(item => {
      //         return {
      //           uuid: item.sla_uuid,
      //           name: item.sla_name,
      //           ns: item.ns_name,
      //           customer: item.cust_email,
      //           date: item.sla_date,
      //           status: item.sla_status
      //         };
      //       })
      //     );
      //   })
      //   .catch(err => reject(err.statusText));

      setTimeout(() => {
        resolve([
          {
            status: "active",
            uuid: "45217851155",
            name: "sla1",
            ns: "ns1",
            customer: "customer1",
            date: new Date().toISOString()
          }
        ]);
      }, 1000);
    });
  }

  /**
   * Retrieves a SLA Agreement by UUID
   *
   * @param uuid UUID of the desired SLA Agreement.
   */
  getOneSLAAgreement(uuid): any {
    return new Promise((resolve, reject) => {
      // let headers = this.authService.getAuthHeaders();
      // this.http
      //   .get(this.config.base + this.config + "/" + uuid, {
      //     headers: headers
      //   })
      //   .toPromise()
      //   .then(response => {
      //     resolve({
      //       uuid: response["uuid"],
      //       name: response["name"],
      //       author: response["author"],
      //       date: response["date"],
      //       ns: response["ns"],
      //       customer: response["customer"],
      //       propertyList: response["propertyList"],
      //       availability: response["availability"],
      //       cost: response["cost"],
      //     });
      //   })
      //   .catch(err => reject(err.statusText));

      setTimeout(() => {
        resolve({
          uuid: uuid,
          name: "name",
          author: "author",
          date: new Date().toISOString(),
          ns: "A",
          customer: "customer1",
          propertyList: [
            {
              property: "property_1",
              guarantee: "guarantee_1"
            },
            { property: "property_22", guarantee: "guarantee_22" }
          ],
          availability: "90%",
          cost: "100€/month"
        });
      }, 1000);
    });
  }
}
