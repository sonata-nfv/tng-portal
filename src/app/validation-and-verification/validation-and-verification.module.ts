import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "../app-routing.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { ValidationAndVerificationPlatformService } from "./validation-and-verification.service";

import { AngularMaterialModule } from "../angular-material/angular-material.module";
import { TestsComponent } from "./tests/tests.component";
import { TestsDetailComponent } from "./tests-detail/tests-detail.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [TestsComponent, TestsDetailComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [ValidationAndVerificationPlatformService]
})
export class ValidationAndVerificationModule {}
