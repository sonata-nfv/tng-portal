import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth-guard";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { RegisteredComponent } from "./registered/registered.component";
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from './users/users.component';
import { ValidationComponent } from './validation/validation.component';
import { ServicePlatformComponent } from './service-platform/service-platform.component';
import { AvailableNetworkServicesComponent } from './available-network-services/available-network-services.component';
import { RequestsComponent } from './requests/requests.component'

const routes: Routes = [
  // Redirect to login while there is no dashboard/menu to display
  // Use authGuard module to authenticate user in every step
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "registered", component: RegisteredComponent },
  { path: "portal", redirectTo: "index", pathMatch: "full" },
  { path: "", component: IndexComponent, canActivate: [AuthGuard], children: [
    { path: "", redirectTo: "dashboard", pathMatch: "full" },
    { path: "dashboard", component: DashboardComponent },
    { path: "users", component: UsersComponent },
    { path: "validation", component: ValidationComponent },
    { path: "servicePlatform", component: ServicePlatformComponent },
    { path: "availableNetworkServices", component: AvailableNetworkServicesComponent },
    { path: "requests", component: RequestsComponent },
  ]}
];

@NgModule({
  // Hashstyle routing (includes # to the URL, not pretty. Instead using pathstyle routing with Nginx)
  // imports: [RouterModule.forRoot(routes, {useHash: true})],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
