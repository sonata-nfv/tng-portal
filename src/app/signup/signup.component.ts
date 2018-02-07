import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { AuthService } from "../services/auth/auth.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
  errorString: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  signup(signupForm: NgForm) {
    const username = signupForm.controls.username.value;
    const password = signupForm.controls.password.value;
    const email = signupForm.controls.email.value;
    const firstName = signupForm.controls.firstName.value;
    const lastName = signupForm.controls.lastName.value;
    const phone = signupForm.controls.phone.value;

    this.authService
      .signup(username, password, email, firstName, lastName, phone)
      .then(() => {
        console.log("registered in register...");
        // Set welcome route when user is registered
        // this.router.navigate(["/welcome"]);
      })
      .catch(err => {
        this.errorString = err;
      });

    console.log("singing up");
  }
}
