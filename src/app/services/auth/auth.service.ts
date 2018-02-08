import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";

@Injectable()
export class AuthService {
  constructor() {}

  login(username: string, password: string): any {
    return new Promise((resolve, reject) => {
      console.log("here in auth service with register!");
      // resolve();
      reject("*Your password or your user/email are wrong.");
    });
  }

  signup(username: string, password: string, email: string): any {
    return new Promise((resolve, reject) => {
      console.log("here in auth service with register!");
      // resolve();
      reject("*This username is already taken.");
    });
  }
}
