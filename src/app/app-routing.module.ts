import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth-guard";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { RegisteredComponent } from "./registered/registered.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MenuComponent } from "./menu/menu.component";

const routes: Routes = [
  // Redirect to login while there is no dashboard/menu to display
  // Use authGuard module to authenticate user in every step
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "portal", redirectTo: "dashboard", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "registered", component: RegisteredComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "menu", component: MenuComponent}
];

@NgModule({
  // Hashstyle routing (includes # to the URL, not pretty. Instead using pathstyle routing with Nginx)
  // imports: [RouterModule.forRoot(routes, {useHash: true})],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
