import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth-guard";

import { IndexComponent } from "./index/index.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { RegisteredComponent } from "./registered/registered.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./users/users.component";
import { ValidationComponent } from "./validation/validation.component";
import { PackagesComponent } from "./packages/packages.component";
import { PackagesDetailComponent } from "./packages-detail/packages-detail.component";
import { SpNetworkServicesComponent } from "./sp-network-services/sp-network-services.component";
import { FunctionsComponent } from "./functions/functions.component";
import { PlacementPolicyComponent } from "./placement-policy/placement-policy.component";
import { SlaTemplatesComponent } from "./sla-templates/sla-templates.component";
import { SlaTemplatesDetailComponent } from "./sla-templates-detail/sla-templates-detail.component";
import { SlaAgreementsComponent } from "./sla-agreements/sla-agreements.component";
import { SlaAgreementsDetailComponent } from "./sla-agreements-detail/sla-agreements-detail.component";
import { SmNetworkServicesComponent } from "./sm-network-services/sm-network-services.component";
import { SmNetworkServiceComponent } from "./sm-network-service/sm-network-service.component";
import { RequestsComponent } from "./requests/requests.component";
import { RequestDetailComponent } from "./request-detail/request-detail.component";
import { NetworkServiceInstancesComponent } from "./network-service-instances/network-service-instances.component";
import { LicencesComponent } from "./licences/licences.component";
import { LicencesDetailComponent } from "./licences-detail/licences-detail.component";
import { ServiceLicencesComponent } from "./service-licences/service-licences.component";
import { UserLicencesComponent } from "./user-licences/user-licences.component";

const routes: Routes = [
  // Redirect to login while there is no dashboard/menu to display
  // Use authGuard module to authenticate user in every step
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "registered", component: RegisteredComponent },
  { path: "portal", redirectTo: "index", pathMatch: "full" },
  {
    path: "",
    component: IndexComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "users", component: UsersComponent },
      { path: "validation", component: ValidationComponent },
      // Service Platform section
      {
        path: "service-platform",
        redirectTo: "service-platform/packages",
        pathMatch: "full"
      },
      {
        path: "service-platform/packages",
        component: PackagesComponent,
        children: [{ path: "detail/:id", component: PackagesDetailComponent }]
      },
      {
        path: "service-platform/sp-network-services",
        component: SpNetworkServicesComponent
      },
      {
        path: "service-platform/functions",
        component: FunctionsComponent
      },
      {
        path: "service-platform/policies/placement-policy",
        component: PlacementPolicyComponent
      },
      {
        path: "service-platform/slas/sla-templates",
        component: SlaTemplatesComponent,
        children: [
          { path: "detail/:id", component: SlaTemplatesDetailComponent }
        ]
      },
      {
        path: "service-platform/slas/sla-agreements",
        component: SlaAgreementsComponent,
        children: [
          { path: "detail/:id", component: SlaAgreementsDetailComponent }
        ]
      },
      // Service Management section
      {
        path: "service-management",
        redirectTo: "service-management/sm-network-services",
        pathMatch: "full"
      },
      {
        path: "service-management/sm-network-services",
        component: SmNetworkServicesComponent,
        children: [{ path: "detail/:id", component: SmNetworkServiceComponent }]
      },
      {
        path: "service-management/requests",
        component: RequestsComponent,
        children: [{ path: "detail/:id", component: RequestDetailComponent }]
      },
      {
        path: "service-management/network-service-instances",
        component: NetworkServiceInstancesComponent
      },
      {
        path: "service-management/licences",
        component: LicencesComponent,
        children: [{ path: "detail/:id", component: LicencesDetailComponent }]
      },
      {
        path: "service-management/licences/service-licences",
        component: ServiceLicencesComponent
      },
      {
        path: "service-management/licences/user-licences",
        component: UserLicencesComponent
      }
    ]
  }
];

@NgModule({
  // Hashstyle routing (includes # to the URL, not pretty. Instead using pathstyle routing with Nginx)
  // imports: [RouterModule.forRoot(routes, {useHash: true})],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
