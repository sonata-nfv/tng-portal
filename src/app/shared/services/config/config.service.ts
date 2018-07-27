import { Injectable } from "@angular/core";

@Injectable()
export class ConfigService {
  base: string = window.location.origin + "/api/v3/";
  register: string = "users/";
  login: string = "sessions/";
  services: string = "services";
  requests: string = "requests";
  instances: string = "records/services";
  licences: string = "licences/";
  packages: string = "packages";
  slaTemplates: string = "slas/templates";
  slaAgreements: string = "slas/agreements";
  guarantees: string = "slas/configurations/guaranteesList";
  functions: string = "functions";
  slicesTemplates: string = "slices";
  slicesInstances: string = "slice-instances";
  tests: string = "tests/descriptors";
  runtimePolicies: string = "policies";

  constructor() {}

  init() {
    if (window.location.origin.includes("localhost")) {
      this.base = "http://int-sp-ath.5gtango.eu:32002/api/v3/";
      this.tests = "http://pre-int-vnv-bcn.5gtango.eu:32002/api/v3/";
    }
  }
}
