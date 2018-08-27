import { Injectable } from "@angular/core";
import { ConfigService } from "../shared/services/config/config.service";
import { AuthService } from "../authentication/auth.service";
import { CommonService } from "../shared/services/common/common.service";

import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class ServiceManagementService {
  authHeaders: HttpHeaders;
  request_uuid: string;

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
              if (res["service"]) {
                requests.push({
                  requestId: res.id,
                  serviceId: res.service.uuid,
                  vendor: res.service.vendor,
                  name: res.service.name,
                  version: res.service.version,
                  type: res.request_type,
                  createdAt: res.created_at,
                  status: res.status
                });
              } else {
                requests.push({
                  requestId: res.id,
                  vendor: "Not available",
                  name: "Not available",
                  version: "Not available",
                  type: res.request_type,
                  createdAt: res.created_at,
                  serviceId: "Not available",
                  status: res.status
                });
              }
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
            resolve({
              requestID: response["id"],
              type: response["request_type"],
              updatedAt: response["updated_at"],
              status: response["status"],
              slaUUID: response["sla_id"],
              serviceVendor: response["service"]["vendor"],
              serviceName: response["service"]["name"],
              serviceVersion: response["service"]["version"],
              serviceUUID: response["service"]["uuid"],
              blacklist: response["blacklist"],
              ingresses: response["ingresses"],
              egresses: response["egresses"]
            });
          } else {
            reject("Unable to fetch the request record!");
          }
        })
        .catch(err => reject("Unable to fetch the request record!"));
    });
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
                createdAt: new Date(Date.parse(item.created_at)).toUTCString(),
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
          resolve();
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
