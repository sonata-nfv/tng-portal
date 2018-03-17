import { Injectable } from "@angular/core";
import { ConfigService } from ".././config/config.service";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";

@Injectable()
export class AuthService {
  authHeaders: HttpHeaders;

  constructor(private config: ConfigService, private http: HttpClient) {}

  login(username: string, password: string): any {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.set("Content-Type", "application/json");

      let data = {
        username: username,
        password: password
      };

      this.http
        .post(this.config.ROUTES.BASE + this.config.ROUTES.LOGIN, data, {
          headers: headers
        })
        .subscribe(
          response => {
            localStorage.setItem("token", response["token"]["access_token"]);
            localStorage.setItem("username", username);
            this.setAuthHeaders();
            resolve();
          },
          (error: HttpErrorResponse) => {
            // reject(error.error.error.message);
            reject("*Your password or your user/email are wrong.");
          }
        );
    });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    return;
    // return new Promise((resolve, reject) => {
    //   let headers = new HttpHeaders();
    //   headers.set("Content-Type", "application/json");

    //   this.http.delete(this.config.ROUTES.BASE + this.config.ROUTES.LOGIN, {
    //       headers: headers
    //     })
    //     .subscribe(
    //       response => {
    //         localStorage.removeItem("token");
    //         localStorage.removeItem("username");
    //         resolve();
    //       },
    //       (error: HttpErrorResponse) => {
    //         // reject(error.error.error.message);
    //         reject();
    //       }
    //     );
    //   });
  }

  signup(username: string, password: string, email: string, userType: string): any {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.set("Content-Type", "application/json");

      let data = {
        username: username,
        password: password,
        email: email,
        user_type: userType.toLocaleLowerCase()
      };
      this.http
        .post(this.config.ROUTES.BASE + this.config.ROUTES.REGISTER, data, {
          headers: headers
        })
        .subscribe(
          response => {
            resolve();
          },
          (error: HttpErrorResponse) => {
            // reject(error.error.error.message);
            reject("Username or email already in use.");
          }
        );
    });
  }

  private setAuthHeaders() {
    this.authHeaders = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem("token")) {
      this.setAuthHeaders();
      return true;
    }
    return false;
  }
}
