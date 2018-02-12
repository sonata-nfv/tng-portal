import { Injectable } from "@angular/core";

import "rxjs/add/operator/toPromise";

import { Config } from "./config";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class ConfigService extends Config {
  private configFile = "../../../../config.json";

  constructor(private http: HttpClient) {
    super();
  }

  init(): Promise<Config> {
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
