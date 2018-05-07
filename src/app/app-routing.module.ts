import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth-guard";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { RegisteredComponent } from "./registered/registered.component";
import { IndexComponent } from "./index/index.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./users/users.component";
import { ValidationComponent } from "./validation/validation.component";
import { PoliciesComponent } from "./policies/policies.component";
import { PackagesComponent } from "./packages/packages.component";
import { PackagesDetailComponent } from "./packages-detail/packages-detail.component";
import { ServicesComponent } from "./services/services.component";
import { FunctionsComponent } from "./functions/functions.component";
import { AvailableNetworkServicesComponent } from "./available-network-services/available-network-services.component";
import { NetworkServiceComponent } from "./network-service/network-service.component";
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
        path: "packages",
        component: PackagesComponent,
        children: [{ path: "detail/:id", component: PackagesDetailComponent }]
      },
      {
        path: "services",
        component: ServicesComponent
      },
      {
        path: "functions",
        component: FunctionsComponent
      },
      { path: "policies", component: PoliciesComponent },
      // Service Management section
      {
        path: "available-network-services",
        component: AvailableNetworkServicesComponent,
        children: [{ path: "detail/:id", component: NetworkServiceComponent }]
      },
      {
        path: "requests",
        component: RequestsComponent,
        children: [{ path: "detail/:id", component: RequestDetailComponent }]
      },
      {
        path: "network-service-instances",
        component: NetworkServiceInstancesComponent
      },
      {
        path: "licences",
        component: LicencesComponent,
        children: [{ path: "detail/:id", component: LicencesDetailComponent }]
      },
      { path: "service-licences", component: ServiceLicencesComponent },
      { path: "user-licences", component: UserLicencesComponent }
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
