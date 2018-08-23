import { Injectable } from "@angular/core";
import { ConfigService } from "../shared/services/config/config.service";
import { AuthService } from "../authentication/auth.service";

import { HttpClient, HttpHeaders } from "@angular/common/http";

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
   * Retrieves a Package by UUID
   *
   * @param uuid UUID of the desired Package.
   */
  getOnePackage(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.baseSP + this.config.packages + "/" + uuid, {
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
   * Retrieves a Function by UUID
   *
   * @param uuid UUID of the desired Function.
   */
  getOneFunction(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.baseSP + this.config.functions + "/" + uuid, {
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
   * Retrieves a SLA Template by UUID
   *
   * @param uuid UUID of the desired SLA Template.
   */
  getOneSLATemplate(uuid): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.baseSP + this.config.slaTemplates + "/" + uuid, {
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
   * Retrieves a list with all the service guarantees
   */
  getServiceGuarantees(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseSP + this.config.guarantees, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve(response["guaranteeTerms"]);
        })
        .catch(err => {
          reject(err.statusText);
        });
    });
  }

  /**
   * Creates a new SLA Template.
   *
   * @param template Object containing the nsd_uuid, guaranteeId, expireDate
   *                 and templateName for the creation of a new template.
   */
  postOneSLATemplate(template): any {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.config.baseSP + this.config.slaTemplates,
          this.urlEncode(template),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => reject(err));
    });
  }

  urlEncode(obj: Object): string {
    let str: string = "";
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof Array) {
        obj[key].forEach(item => {
          str +=
            (str.length > 0 ? "&" : "") +
            encodeURI(key) +
            "=" +
            encodeURI(item);
        });
      } else {
        str +=
          (str.length > 0 ? "&" : "") +
          encodeURI(key) +
          "=" +
          encodeURI(obj[key]);
      }
    });
    return str;
  }

  /**
   * Removes the specified template from the database
   *
   * @param uuid UUID of the desired SLA Template.
   */
  deleteOneSLATemplate(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .delete(this.config.baseSP + this.config.slaTemplates + "/" + uuid, {
          headers: headers,
          responseType: "text"
        })
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => {
          reject(err.statusText);
        });
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
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.slaAgreements + search
          : this.config.baseSP + this.config.slaAgreements;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve(
            response["agreements"].map(item => {
              return {
                uuid: item.sla_uuid,
                name: item.sla_name,
                ns: item.ns_name,
                ns_uuid: item.ns_uuid, //----
                customer: item.cust_email,
                date: new Date(Date.parse(item.sla_date))
                  .toISOString()
                  .replace(/T.*/, "")
                  .split("-")
                  .reverse()
                  .join("/"),
                status: item.sla_status
              };
            })
          );
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a SLA Agreement by UUID
   *
   * @param uuid UUID of the desired SLA Agreement.
   */
  getOneSLAAgreement(sla_uuid: string, ns_uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(
          this.config.baseSP +
            this.config.slaAgreements +
            "/" +
            sla_uuid +
            "/" +
            ns_uuid,
          {
            headers: headers
          }
        )
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["slad"]["name"],
            author: response["slad"]["author"],
            date: response["updated_at"],
            ns: response["slad"]["sla_template"]["ns"]["ns_name"],
            customer:
              response["slad"]["sla_template"]["customer_info"]["cust_email"],
            status: response["status"],
            propertyList:
              response["slad"]["sla_template"]["ns"]["guaranteeTerms"]
            // availability: response["availability"],
            // cost: response["cost"]
          });
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Retrieves a list of SLA Violations.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Violation attributes that must be
   *                          matched by the returned list of
   *                          SLA Violations.
   */
  getSLAViolations(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.slaViolations + search
          : this.config.baseSP + this.config.slaViolations;

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
                  nsInstanceUUID: item.nsi_uuid,
                  slaUUID: item.sla_uuid,
                  date: new Date(Date.parse(item.violation_time)).toUTCString(),
                  customerUUID: item.cust_uuid
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
   * Retrieves a list of Runtime Policies.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Policy attributes that must be
   *                          matched by the returned list of
   *                          Runtime Policies.
   */
  getRuntimePolicies(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.runtimePolicies + search
          : this.config.baseSP + this.config.runtimePolicies;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.filter(policy => policy.ns_uuid).map(item => {
                return {
                  uuid: item.uuid,
                  name: item.pld.name,
                  version: item.pld.version,
                  vendor: item.pld.vendor,
                  ns: item.pld.network_service.name,
                  ns_uuid: item.ns_uuid,
                  default: item.default_policy,
                  enforced: item.enforced ? "Yes" : "No"
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
   * Retrieves a Runtime Policy by UUID
   *
   * @param uuid UUID of the desired Runtime Policy.
   */
  getOneRuntimePolicy(uuid: string) {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseSP + this.config.runtimePolicies + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["pld"]["name"],
            vendor: response["pld"]["vendor"],
            updatedAt: response["updated_at"],
            nsUUID: response["ns_uuid"],
            nsName: response["pld"]["network_service"]["name"],
            version: response["pld"]["version"],
            default: response["default_policy"],
            enforced: response["enforced"] ? "Yes" : "No",
            sla: response["sla_id"], //missing field
            policyRules: [],
            monitoringRules: []
          });
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Generates a Runtime Policy
   *
   * @param policy Data of the desired Runtime Policy
   */
  postOneRuntimePolicy(policy): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .post(this.config.baseSP + this.config.runtimePolicies, policy, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Sets a Runtime Policy as default
   *
   * @param uuid UUID of the desired Runtime Policy
   * @param defaultPolicy Boolean setting the binding with its ns
   * @param nsid UUID of the desired NS
   */
  setDefaultRuntimePolicy(uuid, defaultPolicy, nsid) {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      let data = {
        defaultPolicy,
        nsid
      };

      this.http
        .patch(
          this.config.baseSP + this.config.runtimePoliciesDefault + uuid,
          data,
          {
            headers: headers
          }
        )
        .toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Binds a Runtime Policy to an SLA
   *
   * @param uuid UUID of the desired Runtime Policy
   * @param slaid UUID of the desired SLA
   * @param nsid UUID of the desired NS
   */
  bindRuntimePolicy(uuid, slaid, nsid) {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      let data = {
        slaid,
        nsid
      };

      this.http
        .patch(
          this.config.baseSP + this.config.runtimePoliciesBind + uuid,
          data,
          {
            headers: headers
          }
        )
        .toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Removes the specified runtime policy from the database
   *
   * @param uuid UUID of the desired Runtime Policy.
   */
  deleteOneRuntimePolicy(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .delete(this.config.baseSP + this.config.runtimePolicies + "/" + uuid, {
          headers: headers,
          responseType: "text"
        })
        .toPromise()
        .then(response => {
          resolve(JSON.parse(response));
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Retrieves a list of Generated Actions.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Actions attributes that must be
   *                          matched by the returned list of
   *                          Generated Actions.
   */
  getGeneratedActions(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.runtimePoliciesActions + search
          : this.config.baseSP + this.config.runtimePoliciesActions;

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
                  correlationUUID: item.correlation_id,
                  vnfName: item.action["vnf_name"],
                  scalingType: item.action["scaling_type"],
                  serviceInstanceUUID: item.action["service_instance_id"],
                  value: item.action["value"]
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
   * Retrieves a list of Slices Templates.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Template attributes that must be
   *                          matched by the returned list of
   *                          Slices Templates.
   */
  getSlicesTemplates(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.slicesTemplates + search
          : this.config.baseSP + this.config.slicesTemplates;

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
                  name: item.nstd.name,
                  version: item.nstd.version,
                  vendor: item.nstd.vendor,
                  usageState: item.nstd.usageState,
                  author: item.nstd.author,
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
   * Removes the specified template from the database
   *
   * @param uuid UUID of the desired Slices Template.
   */
  deleteOneSlicesTemplate(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .delete(this.config.baseSP + this.config.slicesTemplates + "/" + uuid, {
          headers: headers,
          responseType: "text"
        })
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => {
          reject(err.statusText);
        });
    });
  }

  /**
   * Retrieves a Slices Template by UUID
   *
   * @param uuid UUID of the desired Slices Template.
   */
  getOneSliceTemplate(uuid): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseSP + this.config.slicesTemplates + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            status: response["status"],
            name: response["nstd"]["name"],
            author: response["nstd"]["author"],
            createdAt: response["created_at"],
            version: response["nstd"]["version"],
            vendor: response["nstd"]["vendor"],
            notificationType: response["nstd"]["notificationTypes"],
            userDefinedData: response["nstd"]["userDefinedData"],
            usageState: response["nstd"]["usageState"],
            onboardingState: response["nstd"]["onboardingState"],
            operationalState: response["nstd"]["operationalState"],
            nstNsdIds: response["nstd"]["nstNsdIds"]
          });
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of Slices Instances.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Instances attributes that must be
   *                          matched by the returned list of
   *                          Slices instances.
   */
  getSlicesInstances(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.slicesInstances + search
          : this.config.baseSP + this.config.slicesInstances;

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
                  name: item.name,
                  vendor: item.vendor,
                  version: item.nstVersion,
                  state: item.nsiState
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => {
          reject(err.statusText);
        });
    });
  }

  /**
   * Retrieves a Slices Instances by UUID
   *
   * @param uuid UUID of the desired Slices Instance.
   */
  getOneSliceInstance(uuid): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseSP + this.config.slicesInstances + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["name"],
            vendor: response["vendor"],
            state: response["nsiState"],
            description: response["description"],
            netServInstanceUUID: response["netServInstance_Uuid"],
            nstName: response["nstName"],
            version: response["nstVersion"]
          });
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Generates a Slice Instance
   *
   * @param instance Data of the desired Slice Instance.
   */
  postOneSliceInstance(instance): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .post(this.config.baseSP + this.config.slicesInstances, instance, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Terminates a Slice Instance by UUID
   *
   * @param uuid UUID of the desired Slices Instance.
   */
  postOneSliceInstanceTermination(uuid): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      const terminateTime = {
        terminateTime: "0"
      };

      this.http
        .post(
          this.config.baseSP +
            this.config.slicesInstances +
            "/" +
            uuid +
            "/terminate",
          terminateTime,
          {
            headers: headers
          }
        )
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => reject(err.statusText));
    });
  }
}
