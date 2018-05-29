import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";

import { AuthService } from "../shared/services/auth/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  errorString: string;
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });
    this.loginForm.valueChanges.subscribe(value => this._onFormChanges(value));
  }

  private _onFormChanges(values) {
    this.errorString = null;
  }

  login(loginForm: FormGroup) {
    const username = loginForm.controls.username.value;
    const password = loginForm.controls.password.value;

    this.authService
      .login(username, password)
      .then(() => {
        // Set menu route when user is authenticated
        this.router.navigate(["/"]);
      })
      .catch(err => {
        this.errorString = err;
      });
  }
}
