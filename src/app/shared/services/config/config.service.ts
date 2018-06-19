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
  templates: string = "slas/templates";
  agreements: string = "slas/agreements";
  functions: string = "functions";

  constructor() {}

  init() {
    if (window.location.origin.includes("localhost")) {
      this.base = "http://pre-int-sp-ath.5gtango.eu:32002/api/v3/";
    }
  }
}
