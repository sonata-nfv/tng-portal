import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth-guard";

import { IndexComponent } from "./index/index.component";

import { LoginComponent } from "./authentication/login/login.component";
import { SignupComponent } from "./authentication/signup/signup.component";
import { RegisteredComponent } from "./authentication/registered/registered.component";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./users/users.component";

import { TestsComponent } from "./validation-and-verification/tests/tests.component";
import { TestsDetailComponent } from "./validation-and-verification/tests-detail/tests-detail.component";
import { TestResultsComponent } from "./validation-and-verification/test-results/test-results.component";
import { VnvNetworkServicesComponent } from ".//validation-and-verification/vnv-network-services/vnv-network-services.component";
import { VnvNetworkServicesDetailComponent } from "./validation-and-verification/vnv-network-services-detail/vnv-network-services-detail.component";
import { VnvPackagesComponent } from "./validation-and-verification/vnv-packages/vnv-packages.component";
import { VnvPackagesDetailComponent } from "./validation-and-verification/vnv-packages-detail/vnv-packages-detail.component";

import { SpPackagesComponent } from "./service-platform/sp-packages/sp-packages.component";
import { SpPackagesDetailComponent } from "./service-platform/sp-packages-detail/sp-packages-detail.component";
import { SpNetworkServicesComponent } from "./service-platform/sp-network-services/sp-network-services.component";
import { SpNetworkServicesDetailComponent } from "./service-platform/sp-network-services-detail/sp-network-services-detail.component";
import { FunctionsComponent } from "./shared/components/functions/functions.component";
import { SpFunctionsDetailComponent } from "./service-platform/sp-functions-detail/sp-functions-detail.component";
import { PlacementPolicyComponent } from "./service-platform/placement-policy/placement-policy.component";
import { RuntimePoliciesComponent } from "./service-platform/runtime-policies/runtime-policies.component";
import { RuntimePoliciesDetailComponent } from "./service-platform/runtime-policies-detail/runtime-policies-detail.component";
import { RuntimePoliciesCreateComponent } from "./service-platform/runtime-policies-create/runtime-policies-create.component";
import { RuntimePoliciesGeneratedActionsComponent } from "./service-platform/runtime-policies-generated-actions/runtime-policies-generated-actions.component";
import { SlaTemplatesComponent } from "./service-platform/sla-templates/sla-templates.component";
import { SlaTemplatesDetailComponent } from "./service-platform/sla-templates-detail/sla-templates-detail.component";
import { SlaTemplatesCreateComponent } from "./service-platform/sla-templates-create/sla-templates-create.component";
import { SlaAgreementsComponent } from "./service-platform/sla-agreements/sla-agreements.component";
import { SlaAgreementsDetailComponent } from "./service-platform/sla-agreements-detail/sla-agreements-detail.component";
import { SlaViolationsComponent } from "./service-platform/sla-violations/sla-violations.component";
import { SlicesTemplatesComponent } from "./service-platform/slices-templates/slices-templates.component";
import { SlicesTemplatesCreateComponent } from "./service-platform/slices-templates-create/slices-templates-create.component";

import { SlicesTemplatesDetailComponent } from "./service-platform/slices-templates-detail/slices-templates-detail.component";
import { SlicesInstancesComponent } from "./service-platform/slices-instances/slices-instances.component";
import { SlicesInstancesDetailComponent } from "./service-platform/slices-instances-detail/slices-instances-detail.component";
import { SlicesInstancesCreateComponent } from "./service-platform/slices-instances-create/slices-instances-create.component";

import { SmNetworkServicesComponent } from "./service-management/sm-network-services/sm-network-services.component";
import { SmNetworkServicesDetailComponent } from "./service-management/sm-network-services-detail/sm-network-services-detail.component";
import { RequestsComponent } from "./shared/components/requests/requests.component";
import { RequestDetailComponent } from "./shared/components/request-detail/request-detail.component";
import { NetworkServiceInstancesComponent } from "./service-management/network-service-instances/network-service-instances.component";
import { NetworkServiceInstancesDetailComponent } from "./service-management/network-service-instances-detail/network-service-instances-detail.component";
import { FunctionRecordsDetailComponent } from "./service-management/function-records-detail/function-records-detail.component";
import { LicencesComponent } from "./service-management/licences/licences.component";
import { LicencesDetailComponent } from "./service-management/licences-detail/licences-detail.component";
import { ServiceLicencesComponent } from "./service-management/service-licences/service-licences.component";
import { UserLicencesComponent } from "./service-management/user-licences/user-licences.component";

const routes: Routes = [
  // Redirect to login while there is no dashboard/menu to display
  // Use authGuard module to authenticate user in every step

  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "registered", component: RegisteredComponent },
  { path: "portal", redirectTo: "" },
  {
    path: "",
    component: IndexComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "users", component: UsersComponent },
      // Validation and verification
      {
        path: "validation-and-verification",
        redirectTo: "validation-and-verification/packages",
        pathMatch: "full"
      },
      {
        path: "validation-and-verification/packages",
        component: VnvPackagesComponent,
        children: [{ path: ":id", component: VnvPackagesDetailComponent }]
      },
      {
        path: "validation-and-verification/network-services",
        component: VnvNetworkServicesComponent,
        children: [
          { path: ":id", component: VnvNetworkServicesDetailComponent }
        ]
      },
      {
        path: "validation-and-verification/functions",
        component: FunctionsComponent
      },
      {
        path: "validation-and-verification/tests",
        component: TestsComponent,
        children: [
          { path: ":id", component: TestsDetailComponent },
          {
            path: ":id/results/:results_uuid",
            component: TestResultsComponent
          }
        ]
      },

      // Service Platform section
      {
        path: "service-platform",
        redirectTo: "service-platform/packages",
        pathMatch: "full"
      },
      {
        path: "service-platform/packages",
        component: SpPackagesComponent,
        children: [{ path: ":id", component: SpPackagesDetailComponent }]
      },
      {
        path: "service-platform/network-services",
        component: SpNetworkServicesComponent,
        children: [{ path: ":id", component: SpNetworkServicesDetailComponent }]
      },
      {
        path: "service-platform/functions",
        component: FunctionsComponent,
        children: [{ path: ":id", component: SpFunctionsDetailComponent }]
      },
      {
        path: "service-platform/policies/placement-policy",
        component: PlacementPolicyComponent
      },
      {
        path: "service-platform/policies/runtime-policies",
        component: RuntimePoliciesComponent,
        children: [
          {
            path: "new",
            component: RuntimePoliciesCreateComponent
          },
          {
            path: ":id",
            component: RuntimePoliciesDetailComponent
          }
        ]
      },
      {
        path: "service-platform/policies/generated-actions",
        component: RuntimePoliciesGeneratedActionsComponent
      },
      {
        path: "service-platform/slas/sla-templates",
        component: SlaTemplatesComponent,
        children: [
          {
            path: "new",
            component: SlaTemplatesCreateComponent
          },
          {
            path: ":id",
            component: SlaTemplatesDetailComponent
          }
        ]
      },
      {
        path: "service-platform/slas/sla-agreements",
        component: SlaAgreementsComponent,
        children: [
          {
            path: ":id_sla/:id_ns",
            component: SlaAgreementsDetailComponent
          }
        ]
      },
      {
        path: "service-platform/slas/sla-violations",
        component: SlaViolationsComponent
      },
      {
        path: "service-platform/slices/slices-templates",
        component: SlicesTemplatesComponent,
        children: [
          { path: "new", component: SlicesTemplatesCreateComponent },
          { path: ":id", component: SlicesTemplatesDetailComponent }
        ]
      },
      {
        path: "service-platform/slices/slices-instances",
        component: SlicesInstancesComponent,
        children: [
          { path: "new", component: SlicesInstancesCreateComponent },
          { path: ":id", component: SlicesInstancesDetailComponent }
        ]
      },
      {
        path: "service-platform/slices/slices-requests",
        component: RequestsComponent,
        children: [{ path: ":id", component: RequestDetailComponent }]
      },
      // Service Management section
      {
        path: "service-management",
        redirectTo: "service-management/network-services",
        pathMatch: "full"
      },
      {
        path: "service-management/network-services",
        component: SmNetworkServicesComponent,
        children: [{ path: ":id", component: SmNetworkServicesDetailComponent }]
      },
      {
        path: "service-management/requests",
        component: RequestsComponent,
        children: [{ path: ":id", component: RequestDetailComponent }]
      },
      {
        path: "service-management/network-service-instances",
        component: NetworkServiceInstancesComponent,
        children: [
          {
            path: ":id",
            component: NetworkServiceInstancesDetailComponent
          },
          {
            path: ":id/vnf/:vnfr_id",
            component: FunctionRecordsDetailComponent
          }
        ]
      },
      {
        path: "service-management/licences",
        component: LicencesComponent,
        children: [{ path: ":id", component: LicencesDetailComponent }]
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
