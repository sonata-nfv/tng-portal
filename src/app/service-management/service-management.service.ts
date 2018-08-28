import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { ConfigService } from "../shared/services/config/config.service";
import { AuthService } from "../authentication/auth.service";
import { CommonService } from "../shared/services/common/common.service";

@Injectable()
export class ServiceManagementService {
  authHeaders: HttpHeaders;
  request_uuid: string;
  NA = "Not available";

  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient
  ) {}

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
                createdAt: this.commonService.formatUTCDate(res.created_at),
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
              updatedAt: this.commonService.formatUTCDate(
                response["updated_at"]
              ),
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
   * Retrieves a list of Network Service instances.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Instance attributes that must be
   *                          matched by the returned list of
   *                          NS instances.
   */
  getNSInstances(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.serviceRecords + search
          : this.config.baseSP + this.config.serviceRecords;

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
                name: item.name,
                status: item.status,
                serviceID: item.descriptor_reference,
                createdAt: this.commonService.formatUTCDate(item.created_at),
                version: item.version,
                latestVersion: "Not available"
              }))
            );
          } else {
            reject();
          }
        })
        .catch(
          err => (err.status === 404 ? resolve([]) : reject(err.statusText))
        );
    });
  }

  /**
   * Retrieves a Network Service Instance by UUID
   *
   * @param uuid UUID of the desired NS instance.
   */
  getOneNSInstance(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseSP + this.config.serviceRecords + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response.hasOwnProperty("uuid")) {
            resolve({
              uuid: response["uuid"],
              status: response["status"],
              serviceID: response["descriptor_reference"],
              version: response["version"],
              updatedAt: response["updated_at"],
              vnf: response["network_functions"],
              virtualLinks: response["virtual_links"]
            });
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a Function Record by UUID
   *
   * @param uuid UUID of the desired Function Record.
   */
  getFunctionRecords(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseSP + this.config.functionRecords + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response.hasOwnProperty("uuid")) {
            resolve({
              vdus: response["virtual_deployment_units"],
              virtualLinks: response["virtual_links"]
            });
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Network service instantiation
   *
   * @param name Name given to the instance
   * @param service Information about the service about to be instantiated
   * @param ingress Ingress points of the instantiation
   * @param egress Egress points of the instantiation
   * @param sla Selected service level agreement in the instantiation
   */
  postNSRequest(
    name: string,
    serviceUUID: Object,
    ingress: Array<Object>,
    egress: Array<Object>,
    slaUUID: string
  ) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      let data = {
        name,
        sla_id: slaUUID,
        service_uuid: serviceUUID,
        ingresses: ingress,
        egresses: egress
      };

      this.http
        .post(this.config.baseSP + this.config.requests, data, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve(response["name"]);
        })
        .catch(err =>
          reject(
            "There was an error while trying to instantiate this network service"
          )
        );
    });
  }

  /*
  * Terminates a Network Service Instance by UUID
  *
  * @param uuid UUID of the desired Network Service Instance.
  */
  postOneNSInstanceTermination(uuid): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      let data = {
        instance_uuid: uuid,
        request_type: "TERMINATE_SERVICE"
      };

      this.http
        .post(this.config.baseSP + this.config.requests, data, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve("Terminated");
        })
        .catch(err =>
          reject("There was an error terminating the network service instance")
        );
    });
  }

  getLicences(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.baseSP + this.config.licences, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(err => reject(err.statusText));
    });
  }
}
