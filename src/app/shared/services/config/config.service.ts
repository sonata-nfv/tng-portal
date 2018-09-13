import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { Config } from "./config";

@Injectable()
export class ConfigService extends Config {
  baseSP: string = window.location.origin + "/api/v3/";
  baseVNV: string = window.location.origin + "/api/v3/";
  register: string = "users/";
  login: string = "sessions/";
  services: string = "services";
  requests: string = "requests";
  serviceRecords: string = "records/services";
  functionRecords: string = "records/functions";
  licences: string = "licences/";
  packages: string = "packages";
  slaTemplates: string = "slas/templates";
  slaAgreements: string = "slas/agreements";
  slaViolations: string = "slas/violations";
  guarantees: string = "slas/configurations/guaranteesList";
  functions: string = "functions";
  slicesTemplates: string = "slices";
  slicesInstances: string = "slice-instances";
  tests: string = "tests/descriptors";
  testExecute: string = "tests/plans";
  testExecutions: string = "tests/results";
  runtimePolicies: string = "policies";
  runtimePoliciesBind: string = "policies/bind/";
  runtimePoliciesDefault: string = "policies/default/";
  runtimePoliciesActions: string = "policies/actions";

  private configFile = "./config.json";

  constructor(private http: HttpClient) {
    super();
  }

  init(): Promise<Config> {
    if (window.location.origin.includes("localhost")) {
      this.baseSP = "http://pre-int-sp-ath.5gtango.eu:32002/api/v3/";
      this.baseVNV = "http://pre-int-vnv-bcn.5gtango.eu:32002/api/v3/";
    }

    return new Promise<Config>((resolve, reject) => {
      this.http.get(this.configFile).subscribe(
        response => {
          Object.assign(this, response as Config);
          resolve(this);
        },
        (error: HttpErrorResponse) => {
          reject(error.error);
        }
      );
    });
  }
}
