import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "../app-routing.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { ValidationAndVerificationPlatformService } from "./validation-and-verification.service";
import { ChartService } from "./chart/chart.service";

import { AngularMaterialModule } from "../angular-material/angular-material.module";
import { TestsComponent } from "./tests/tests.component";
import { TestsDetailComponent } from "./tests-detail/tests-detail.component";
import { TestResultsComponent } from "./test-results/test-results.component";
import { SharedModule } from "../shared/shared.module";
import { VnvPackagesComponent } from "./vnv-packages/vnv-packages.component";
import { VnvPackagesDetailComponent } from "./vnv-packages-detail/vnv-packages-detail.component";
import { VnvNetworkServicesComponent } from "./vnv-network-services/vnv-network-services.component";
import { VnvNetworkServicesDetailComponent } from "./vnv-network-services-detail/vnv-network-services-detail.component";

@NgModule({
  declarations: [
    TestsComponent,
    TestsDetailComponent,
    TestResultsComponent,
    VnvPackagesComponent,
    VnvPackagesDetailComponent,
    VnvNetworkServicesComponent,
    VnvNetworkServicesDetailComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [ValidationAndVerificationPlatformService, ChartService]
})
export class ValidationAndVerificationModule {}
