import { APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { MAT_DATE_LOCALE } from "@angular/material";

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

import { TestsComponent } from "./tests/tests.component";

import { PackagesComponent } from "./packages/packages.component";
import { PackagesDetailComponent } from "./packages-detail/packages-detail.component";
import { SpNetworkServicesComponent } from "./sp-network-services/sp-network-services.component";
import { SpNetworkServicesDetailComponent } from "./sp-network-services-detail/sp-network-services-detail.component";
import { FunctionsComponent } from "./functions/functions.component";
import { FunctionsDetailComponent } from "./functions-detail/functions-detail.component";
import { PlacementPolicyComponent } from "./placement-policy/placement-policy.component";
import { SlaTemplatesComponent } from "./sla-templates/sla-templates.component";
import { SlaTemplatesDetailComponent } from "./sla-templates-detail/sla-templates-detail.component";
import { SlaTemplatesCreateComponent } from "./sla-templates-create/sla-templates-create.component";
import { SlaAgreementsComponent } from "./sla-agreements/sla-agreements.component";
import { SlaAgreementsDetailComponent } from "./sla-agreements-detail/sla-agreements-detail.component";
import { SlicesTemplatesComponent } from "./slices-templates/slices-templates.component";
import { SlicesTemplatesDetailComponent } from "./slices-templates-detail/slices-templates-detail.component";
import { SlicesInstancesComponent } from "./slices-instances/slices-instances.component";
import { SlicesInstancesDetailComponent } from "./slices-instances-detail/slices-instances-detail.component";
import { SlicesInstancesCreateComponent } from "./slices-instances-create/slices-instances-create.component";

import { SmNetworkServicesComponent } from "./sm-network-services/sm-network-services.component";
import { SmNetworkServicesDetailComponent } from "./sm-network-services-detail/sm-network-services-detail.component";
import { NsInstantiateDialogComponent } from "./ns-instantiate-dialog/ns-instantiate-dialog.component";
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
    MenuComponent,
    IndexComponent,
    DashboardComponent,
    UsersComponent,
    TestsComponent,
    PackagesComponent,
    PackagesDetailComponent,
    SpNetworkServicesComponent,
    SpNetworkServicesDetailComponent,
    FunctionsComponent,
    FunctionsDetailComponent,
    PlacementPolicyComponent,
    SlaTemplatesComponent,
    SlaTemplatesDetailComponent,
    SlaTemplatesCreateComponent,
    SlaAgreementsComponent,
    SlaAgreementsDetailComponent,
    SlicesTemplatesComponent,
    SlicesTemplatesDetailComponent,
    SlicesInstancesComponent,
    SlicesInstancesDetailComponent,
    SlicesInstancesCreateComponent,
    SmNetworkServicesComponent,
    SmNetworkServicesDetailComponent,
    RequestsComponent,
    RequestDetailComponent,
    NetworkServiceInstancesComponent,
    LicencesComponent,
    LicencesDetailComponent,
    ServiceLicencesComponent,
    UserLicencesComponent,
    SpinnerComponent,
    NsInstantiateDialogComponent,
    CalendarComponent,
    SelectComponent,
    SearchBarComponent,
    DialogComponent,
    FilterPipe,
    FeatureAvailableDirective
  ],
  entryComponents: [DialogComponent, NsInstantiateDialogComponent],
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
    },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
