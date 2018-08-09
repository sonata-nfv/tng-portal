import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthService } from "./auth.service";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { RegisteredComponent } from "./registered/registered.component";
import { AngularMaterialModule } from "../angular-material/angular-material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { AppRoutingModule } from "../app-routing.module";

@NgModule({
  declarations: [LoginComponent, SignupComponent, RegisteredComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule
  ],
  exports: [LoginComponent, SignupComponent, RegisteredComponent],
  providers: [AuthService]
})
export class AuthenticationModule {}
