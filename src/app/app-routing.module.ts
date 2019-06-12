import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth-guard';

import { IndexComponent } from './index/index.component';

import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { TermsOfUsageComponent } from './authentication/terms-of-usage/terms-of-usage.component';
import { RegisteredComponent } from './authentication/registered/registered.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';

import { PlatformListComponent } from './platforms/platform-list/platform-list.component';
import { PlatformComponent } from './platforms/platform/platform.component';

import { EndpointListComponent } from './settings/endpoint-list/endpoint-list.component';
import { VimListComponent } from './settings/vim-list/vim-list.component';
import { VimComponent } from './settings/vim/vim.component';
import { WimListComponent } from './settings/wim-list/wim-list.component';
import { WimComponent } from './settings/wim/wim.component';

import { TestsComponent } from './validation-and-verification/tests/tests.component';
import { TestsDetailComponent } from './validation-and-verification/tests-detail/tests-detail.component';
import { TestResultsComponent } from './validation-and-verification/test-results/test-results.component';
import { VnvNetworkServicesComponent } from './/validation-and-verification/vnv-network-services/vnv-network-services.component';
import {
	VnvNetworkServicesDetailComponent
} from './validation-and-verification/vnv-network-services-detail/vnv-network-services-detail.component';
import { VnvPackagesComponent } from './validation-and-verification/vnv-packages/vnv-packages.component';
import { VnvPackagesDetailComponent } from './validation-and-verification/vnv-packages-detail/vnv-packages-detail.component';

import { SpPackagesComponent } from './service-platform/sp-packages/sp-packages.component';
import { SpPackagesDetailComponent } from './service-platform/sp-packages-detail/sp-packages-detail.component';
import { SpNetworkServicesComponent } from './service-platform/sp-network-services/sp-network-services.component';
import { SpNetworkServicesDetailComponent } from './service-platform/sp-network-services-detail/sp-network-services-detail.component';
import { FunctionsComponent } from './shared/components/functions/functions.component';
import { SpFunctionsDetailComponent } from './service-platform/sp-functions-detail/sp-functions-detail.component';
import { PlacementPolicyComponent } from './service-platform/placement-policy/placement-policy.component';
import { RuntimePoliciesComponent } from './service-platform/runtime-policies/runtime-policies.component';
import { RuntimePoliciesDetailComponent } from './service-platform/runtime-policies-detail/runtime-policies-detail.component';
import { RuntimePoliciesCreateComponent } from './service-platform/runtime-policies-create/runtime-policies-create.component';
import {
	RuntimePoliciesGeneratedActionsComponent
} from './service-platform/runtime-policies-generated-actions/runtime-policies-generated-actions.component';
import { SlaTemplateListComponent } from './service-platform/sla-template-list/sla-template-list.component';
import { SlaTemplateDetailComponent } from './service-platform/sla-template-detail/sla-template-detail.component';
import { SlaTemplateCreateComponent } from './service-platform/sla-template-create/sla-template-create.component';
import { SlaAgreementListComponent } from './service-platform/sla-agreement-list/sla-agreement-list.component';
import { SlaAgreementDetailComponent } from './service-platform/sla-agreement-detail/sla-agreement-detail.component';
import { SlaViolationsComponent } from './service-platform/sla-violations/sla-violations.component';
import { SpSliceTemplateListComponent } from './service-platform/sp-slice-template-list/sp-slice-template-list.component';
import { SpSliceTemplateCreateComponent } from './service-platform/sp-slice-template-create/sp-slice-template-create.component';
import { SpSliceTemplateDetailComponent } from './service-platform/sp-slice-template-detail/sp-slice-template-detail.component';

import { SmSliceTemplateListComponent } from './service-management/sm-slice-template-list/sm-slice-template-list.component';
import { SmSliceTemplateDetailComponent } from './service-management/sm-slice-template-detail/sm-slice-template-detail.component';
import { SliceInstanceListComponent } from './service-management/slice-instance-list/slice-instance-list.component';
import { SliceInstanceDetailComponent } from './service-management/slice-instance-detail/slice-instance-detail.component';
import { SliceInstanceCreateComponent } from './service-management/slice-instance-create/slice-instance-create.component';
import { SmNetworkServicesComponent } from './service-management/sm-network-services/sm-network-services.component';
import { SmNetworkServicesDetailComponent } from './service-management/sm-network-services-detail/sm-network-services-detail.component';
import { RequestListComponent } from './service-management/request-list/request-list.component';
import { RequestDetailComponent } from './service-management/request-detail/request-detail.component';
import { NsInstanceListComponent } from './service-management/ns-instance-list/ns-instance-list.component';
import {
	NsInstanceDetailComponent
} from './service-management/ns-instance-detail/ns-instance-detail.component';
import { LicenceListComponent } from './service-management/license-list/license-list.component';
import { LicenceDetailComponent } from './service-management/license-detail/license-detail.component';


const routes: Routes = [
	// Redirect to login while there is no dashboard/menu to display
	// Use authGuard module to authenticate user in every step

	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'terms-of-usage', component: TermsOfUsageComponent },
	{ path: 'registered', component: RegisteredComponent },
	{ path: 'portal', redirectTo: '' },
	{
		path: '',
		component: IndexComponent,
		canActivate: [ AuthGuard ],
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'users', component: UsersComponent },
			// Platforms
			{
				path: 'platforms', component: PlatformListComponent,
				children: [
					{ path: 'new', component: PlatformComponent },
					{ path: ':id', component: PlatformComponent }
				]
			},
			// Settings
			{ path: 'settings', redirectTo: 'settings/endpoint', pathMatch: 'full' },
			{ path: 'settings/endpoint', component: EndpointListComponent },
			{
				path: 'settings/vim', component: VimListComponent,
				children: [
					{ path: 'new', component: VimComponent },
					{ path: ':id', component: VimComponent }
				]
			},
			{
				path: 'settings/wim', component: WimListComponent,
				children: [
					{ path: 'new', component: WimComponent },
					{ path: ':id', component: WimComponent }
				]
			},
			// Validation and verification
			{ path: 'validation-and-verification', redirectTo: 'validation-and-verification/packages', pathMatch: 'full' },
			{
				path: 'validation-and-verification/packages', component: VnvPackagesComponent,
				children: [ { path: ':id', component: VnvPackagesDetailComponent } ]
			},
			{
				path: 'validation-and-verification/network-services',
				component: VnvNetworkServicesComponent,
				children: [ { path: ':id', component: VnvNetworkServicesDetailComponent } ]
			},
			{ path: 'validation-and-verification/functions', component: FunctionsComponent },
			{
				path: 'validation-and-verification/tests', component: TestsComponent,
				children: [
					{ path: ':id', component: TestsDetailComponent },
					{ path: ':id/results/:results_uuid', component: TestResultsComponent }
				]
			},
			// Service Platform section
			{ path: 'service-platform', redirectTo: 'service-platform/packages', pathMatch: 'full' },
			{
				path: 'service-platform/packages', component: SpPackagesComponent,
				children: [ { path: ':id', component: SpPackagesDetailComponent } ]
			},
			{
				path: 'service-platform/network-services', component: SpNetworkServicesComponent,
				children: [ { path: ':id', component: SpNetworkServicesDetailComponent } ]
			},
			{
				path: 'service-platform/functions', component: FunctionsComponent,
				children: [ { path: ':id', component: SpFunctionsDetailComponent } ]
			},
			{ path: 'service-platform/policies/placement-policy', component: PlacementPolicyComponent },
			{
				path: 'service-platform/policies/runtime-policies', component: RuntimePoliciesComponent,
				children: [
					{ path: 'new', component: RuntimePoliciesCreateComponent },
					{ path: ':id', component: RuntimePoliciesDetailComponent }
				]
			},
			{ path: 'service-platform/policies/generated-actions', component: RuntimePoliciesGeneratedActionsComponent },
			{
				path: 'service-platform/slas/sla-templates', component: SlaTemplateListComponent,
				children: [
					{ path: 'new', component: SlaTemplateCreateComponent },
					{ path: ':id', component: SlaTemplateDetailComponent }
				]
			},
			{
				path: 'service-platform/slas/sla-agreements', component: SlaAgreementListComponent,
				children: [ { path: ':id_sla/:id_nsi', component: SlaAgreementDetailComponent } ]
			},
			{ path: 'service-platform/slas/sla-violations', component: SlaViolationsComponent },
			{
				path: 'service-platform/slices/slice-templates', component: SpSliceTemplateListComponent,
				children: [
					{ path: 'new', component: SpSliceTemplateCreateComponent },
					{ path: ':id', component: SpSliceTemplateDetailComponent }
				]
			},
			// Service Management section
			{ path: 'service-management', redirectTo: 'service-management/network-services/services', pathMatch: 'full' },
			{
				path: 'service-management/slices/slice-templates', component: SmSliceTemplateListComponent,
				children: [
					{ path: ':id', component: SmSliceTemplateDetailComponent }
				]
			},
			{
				path: 'service-management/slices/slice-instances', component: SliceInstanceListComponent,
				children: [
					{ path: 'new', component: SliceInstanceCreateComponent },
					{ path: ':id', component: SliceInstanceDetailComponent }
				]
			},
			{
				path: 'service-management/network-services/services', component: SmNetworkServicesComponent,
				children: [ { path: ':id', component: SmNetworkServicesDetailComponent } ]
			},
			{
				path: 'service-management/network-services/network-service-instances', component: NsInstanceListComponent,
				children: [
					{ path: ':id', component: NsInstanceDetailComponent }
				]
			},
			{
				path: 'service-management/requests', component: RequestListComponent,
				children: [ { path: ':id', component: RequestDetailComponent } ]
			},
			{
				path: 'service-management/licenses', component: LicenceListComponent,
				children: [ { path: ':id', component: LicenceDetailComponent } ]
			}
		]
	}
];

@NgModule({
	// Hashstyle routing (includes # to the URL, not pretty. Instead using pathstyle routing with Nginx)
	// imports: [RouterModule.forRoot(routes, {useHash: true})],
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ],
	providers: [ AuthGuard ]
})
export class AppRoutingModule { }
