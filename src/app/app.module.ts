import { APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AngularMaterialModule } from "./angular-material/angular-material.module";
import { AppRoutingModule } from "./app-routing.module";
import { SpinnerComponent } from "./spinner/spinner.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { SelectComponent } from "./select/select.component";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { RegisteredComponent } from "./registered/registered.component";

import { MenuComponent } from "./menu/menu.component";
import { IndexComponent } from "./index/index.component";

import { DashboardComponent } from "./dashboard/dashboard.component";

import { UsersComponent } from "./users/users.component";

import { ValidationComponent } from "./validation/validation.component";

import { PlacementPolicyComponent } from "./placement-policy/placement-policy.component";
import { PackagesComponent } from "./packages/packages.component";
import { PackagesDetailComponent } from "./packages-detail/packages-detail.component";
import { ServicesComponent } from "./services/services.component";
import { FunctionsComponent } from "./functions/functions.component";
import { SlaTemplatesComponent } from "./sla-templates/sla-templates.component";
import { SlaTemplatesDetailComponent } from "./sla-templates-detail/sla-templates-detail.component";
import { SlaAgreementsComponent } from "./sla-agreements/sla-agreements.component";

import { AvailableNetworkServicesComponent } from "./available-network-services/available-network-services.component";
import { NetworkServiceComponent } from "./network-service/network-service.component";
import { InstantiateDialogComponent } from "./instantiate-dialog/instantiate-dialog.component";
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { DialogComponent } from "./dialog/dialog.component";
import { RequestsComponent } from "./requests/requests.component";
import { RequestDetailComponent } from "./request-detail/request-detail.component";
import { NetworkServiceInstancesComponent } from "./network-service-instances/network-service-instances.component";
import { LicencesComponent } from "./licences/licences.component";
import { LicencesDetailComponent } from "./licences-detail/licences-detail.component";
import { ServiceLicencesComponent } from "./service-licences/service-licences.component";
import { UserLicencesComponent } from "./user-licences/user-licences.component";

import { AuthService } from "./shared/services/auth/auth.service";
import { ConfigService } from "./shared/services/config/config.service";
import { CommonService } from "./shared/services/common/common.service";
import { ServiceManagementService } from "./shared/services/service-management/service-management.service";
import { DataTransferService } from "./shared/services/service-management/dataTransfer.service";
import { ServicePlatformService } from "./shared/services/service-platform/service-platform.service";
import { DialogDataService } from "./shared/services/dialog/dialog.service";

import { FeatureAvailableDirective } from "./shared/directives/feature-available.directive";

import { FilterPipe } from "./shared/filter.pipe";

export function initConfiguration(configService: ConfigService): Function {
  return () => configService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    RegisteredComponent,
    DashboardComponent,
    MenuComponent,
    IndexComponent,
    FeatureAvailableDirective,
    UsersComponent,
    ValidationComponent,
    PlacementPolicyComponent,
    AvailableNetworkServicesComponent,
    FilterPipe,
    SearchBarComponent,
    DialogComponent,
    InstantiateDialogComponent,
    RequestsComponent,
    NetworkServiceInstancesComponent,
    ServiceLicencesComponent,
    UserLicencesComponent,
    NetworkServiceComponent,
    RequestDetailComponent,
    SpinnerComponent,
    LicencesComponent,
    LicencesDetailComponent,
    PackagesComponent,
    PackagesDetailComponent,
    ServicesComponent,
    FunctionsComponent,
    SlaTemplatesComponent,
    SlaTemplatesDetailComponent,
    CalendarComponent,
    SelectComponent,
    SlaAgreementsComponent
  ],
  entryComponents: [DialogComponent, InstantiateDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    ConfigService,
    CommonService,
    ServiceManagementService,
    DataTransferService,
    ServicePlatformService,
    DialogDataService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfiguration,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
