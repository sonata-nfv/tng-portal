import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { AuthService } from "../services/auth/auth.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
  userErrorString: string;
  passwordErrorString: string;
  emailErrorString: string = "This is not a valid email.";

  signupForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.signupForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl(),
      email: new FormControl(null, Validators.email)
    });
    this.signupForm.valueChanges.subscribe(value => this._onFormChanges(value));
  }

  private _onFormChanges(values) {
    // Check if both password fields match
    // Possibility to add password restrictions
    if (values.confirmPassword !== null) {
      if (values.password !== values.confirmPassword) {
        this.passwordErrorString = "*Passwords do not match.";
      } else {
        this.passwordErrorString = null;
      }
    }
  }

  signup(signupForm: FormGroup) {
    this.authService
      .signup(
        this.signupForm.value.username,
        this.signupForm.value.password,
        this.signupForm.value.email
      )
      .then(() => {
        // Set welcome route when user is registered
        this.router.navigate(["/registered"]);
      })
      .catch(err => {
        this.userErrorString = err;
      });
  }
}
