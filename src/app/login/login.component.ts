import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { AuthService } from "../services/auth/auth.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  errorString: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  login(loginForm: NgForm) {
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
