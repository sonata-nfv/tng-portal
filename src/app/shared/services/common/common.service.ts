import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from "@angular/material";

import { ConfigService } from "../config/config.service";
import { AuthService } from "../../../authentication/auth.service";

@Injectable()
export class CommonService {
  authHeaders: HttpHeaders;
  request_uuid: string;
  NA = "Not available";

  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Opens a snack bar for notifications on the bottom of the screen
   *
   * @param message Message to be displayed
   * @param action Action displayed in the button
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

  /**
   * Compares two objects property to property
   *
   * @param obj1 First object to compare
   * @param obj2 Second object to compare
   */
  compareObjects(obj1, obj2) {
    var obj1Props = Object.getOwnPropertyNames(obj1);
    var obj2Props = Object.getOwnPropertyNames(obj2);

    if (obj1Props.length != obj2Props.length) {
      return false;
    }

    obj1Props.forEach(prop => {
      if (obj1[prop] !== obj2[prop]) {
        return false;
      }
    });

    return true;
  }

  /**
   * Prepares the received date to be displayed in the screen
   *
   * @param dateIn Date to be displayed
   */
  formatUTCDate(dateIn) {
    return new Date(Date.parse(dateIn)).toUTCString();
  }

  /**
   * Retrieves a list of Packages.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Packages attributes that must be
   *                          matched by the returned list of
   *                          packages.
   */
  getPackages(section, search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url: string;

      if (section == "VALIDATION AND VERIFICATION") {
        url =
          search != undefined
            ? this.config.baseVNV + this.config.packages + search
            : this.config.baseVNV + this.config.packages;
      } else {
        url =
          search != undefined
            ? this.config.baseSP + this.config.packages + search
            : this.config.baseSP + this.config.packages;
      }

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
                  version: item.pd.version,
                  createdAt: this.formatUTCDate(item.created_at),
                  status: item.status,
                  type: "public"
                };
              })
            );
          } else {
            reject("There was an error fetching the packages");
          }
        })
        .catch(err => reject("There was an error fetching the packages"));
    });
  }

  /**
   * Retrieves a Package by UUID
   *
   * @param uuid UUID of the desired Package.
   */
  getOnePackage(section, uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      const uri = section === "vnv" ? this.config.baseVNV : this.config.baseSP;

      this.http
        .get(uri + this.config.packages + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["pd"]["name"],
            author: response["pd"]["maintainer"],
            createdAt: this.formatUTCDate(response["created_at"]),
            updatedAt: this.formatUTCDate(response["updated_at"]),
            vendor: response["pd"]["vendor"],
            version: response["pd"]["version"],
            status: response["status"],
            type: "public",
            ns: this.getPackageContent(response["pd"]["package_content"], "ns"),
            vnf: this.getPackageContent(
              response["pd"]["package_content"],
              "vnf"
            ),
            tests: this.getPackageContent(
              response["pd"]["package_content"],
              "tests"
            )
          });
        })
        .catch(err => reject("There was an error fetching the package"));
    });
  }

  getPackageContent(content, type) {
    let obj: string;
    let result = new Array();

    content.forEach(item => {
      if (item["content-type"] === "application/vnd.5gtango.nsd") {
        obj = "ns";
      } else if (item["content-type"] === "application/vnd.5gtango.vnfd") {
        obj = "vnf";
      } else if (item["content-type"] === "application/vnd.5gtango.tstd") {
        obj = "tests";
      } else {
        obj = null;
      }

      if (obj === type) {
        result.push({
          vendor: item.id.vendor,
          name: item.id.name,
          version: item.id.version
        });
      }
    });

    return result;
  }

  /**
   * Retrieves a list of Functions.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Packages attributes that must be
   *                          matched by the returned list of
   *                          packages.
   */
  getFunctions(section, search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      let url: string;
      if (section == "VALIDATION AND VERIFICATION") {
        url =
          search != undefined
            ? this.config.baseVNV + this.config.functions + search
            : this.config.baseVNV + this.config.functions;
      } else {
        url =
          search != undefined
            ? this.config.baseSP + this.config.functions + search
            : this.config.baseSP + this.config.functions;
      }

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
            reject("There was an error fetching the functions");
          }
        })
        .catch(err => reject("There was an error fetching the functions"));
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
          ? this.config.baseSP + this.config.slaTemplates + search
          : this.config.baseSP + this.config.slaTemplates;
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
                  vendor: item.slad.vendor,
                  name: item.slad.name,
                  version: item.slad.version,
                  nsUUID: item.slad.sla_template.ns.ns_uuid,
                  ns: item.slad.sla_template.ns.ns_name,
                  expirationDate: this.formatUTCDate(
                    item.slad.sla_template.valid_until
                  ),
                  status: item.status
                };
              })
            );
          } else {
            reject("There was an error fetching the sla templates");
          }
        })
        .catch(err => reject("There was an error fetching the sla templates"));
    });
  }

  /**
   * Retrieves a list of Available Network Services.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Network Service attributes that
   *                          must be matched by the returned
   *                          list of NS.
   */
  getNetworkServices(section, search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      let url: string;
      if (section == "VALIDATION AND VERIFICATION") {
        url =
          search != undefined
            ? this.config.baseVNV + this.config.services + search
            : this.config.baseVNV + this.config.services;
      } else {
        url =
          search != undefined
            ? this.config.baseSP + this.config.services + search
            : this.config.baseSP + this.config.services;
      }

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => ({
                uuid: item.uuid,
                name: item.nsd.name,
                serviceId: item.uuid,
                vendor: item.nsd.vendor,
                version: item.nsd.version,
                status: item.status,
                licenses: "None",
                slas: "/service-platform/slas/sla-templates"
              }))
            );
          } else {
            reject("There was an error while fetching the network services");
          }
        })
        .catch(err =>
          reject("There was an error while fetching the network services")
        );
    });
  }

  /**
   * Retrieves a Network Service by UUID
   *
   * @param uuid UUID of the desired Network Service.
   */
  getOneNetworkService(section, uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      const uri = section === "vnv" ? this.config.baseVNV : this.config.baseSP;

      this.http
        .get(uri + this.config.services + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response.hasOwnProperty("nsd")) {
            resolve({
              uuid: response["uuid"],
              name: response["nsd"]["name"],
              author: response["nsd"]["author"],
              version: response["nsd"]["version"],
              status: response["status"],
              vendor: response["nsd"]["vendor"],
              serviceID: response["uuid"],
              type: response["user_licence"],
              description: response["nsd"]["description"],
              createdAt: this.formatUTCDate(response["created_at"]),
              updatedAt: this.formatUTCDate(response["updated_at"]),
              vnf: response["nsd"]["network_functions"]
            });
          } else {
            reject("There was an error while fetching the network service!");
          }
        })
        .catch(err =>
          reject("There was an error while fetching the network service!")
        );
    });
  }

  /**
   * Retrieves a list of Network Service requests.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Request attributes that must be
   *                          matched by the returned list of
   *                          NS requests.
   */
  getNSRequests(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.requests + search
          : this.config.baseSP + this.config.requests;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            let requests = new Array();
            response.forEach(res => {
              let req = this.prepareNSRequest({
                requestId: res.id,
                name: res.name,
                serviceName: res["service"] ? res.service.name : this.NA,
                type: res.request_type,
                createdAt: this.formatUTCDate(res.created_at),
                status: res.status
              });
              requests.push(req);
            });
            resolve(requests);
          } else {
            reject("There was an error while fetching the requests!");
          }
        })
        .catch(err => {
          reject("There was an error while fetching the requests!");
        });
    });
  }

  /**
   * Retrieves a Network Service request by UUID
   *
   * @param uuid UUID of the desired NS request.
   */
  getOneNSRequest(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseSP + this.config.requests + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response.hasOwnProperty("id")) {
            let request = {
              requestUUID: response["id"],
              name: response["name"],
              type: response["request_type"],
              updatedAt: this.formatUTCDate(response["updated_at"]),
              status: response["status"],
              slaUUID: response["sla_id"],
              serviceVendor: response["service"]["vendor"],
              serviceName: response["service"]["name"],
              serviceVersion: response["service"]["version"],
              serviceUUID: response["service"]["uuid"],
              blacklist: response["blacklist"],
              ingresses: response["ingresses"],
              egresses: response["egresses"]
            };
            this.prepareNSRequest(request);
            resolve(request);
          } else {
            reject("Unable to fetch the request record!");
          }
        })
        .catch(err => reject("Unable to fetch the request record!"));
    });
  }

  prepareNSRequest(item) {
    const parts = item.type.split("_");
    let str: string = "";

    parts.forEach(part => {
      str = str.concat(
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() + " "
      );
    });

    item.type = str;

    item.status =
      item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase();

    return item;
  }

  /**
   * Retrieves the existing vims represented by the city name
   */
  requestVims(): any {
    return ["Athens", "Aveiro", "Barcelona", "Paderborn"];
  }
}
