import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from '../app-routing.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { ServicePlatformService } from './service-platform.service';

import { SpPackagesComponent } from './sp-packages/sp-packages.component';
import { SpPackagesDetailComponent } from './sp-packages-detail/sp-packages-detail.component';
import { SpNetworkServicesComponent } from './sp-network-services/sp-network-services.component';
import { SpNetworkServicesDetailComponent } from './sp-network-services-detail/sp-network-services-detail.component';
import { SpFunctionsDetailComponent } from './sp-functions-detail/sp-functions-detail.component';
import { PlacementPolicyComponent } from './placement-policy/placement-policy.component';
import { RuntimePoliciesComponent } from './runtime-policies/runtime-policies.component';
import { RuntimePoliciesDetailComponent } from './runtime-policies-detail/runtime-policies-detail.component';
import { RuntimePoliciesCreateComponent } from './runtime-policies-create/runtime-policies-create.component';
import {
	RuntimePoliciesGeneratedActionsComponent
} from './runtime-policies-generated-actions/runtime-policies-generated-actions.component';
import { SlaTemplateListComponent } from './sla-template-list/sla-template-list.component';
import { SlaTemplateDetailComponent } from './sla-template-detail/sla-template-detail.component';
import { SlaTemplateCreateComponent } from './sla-template-create/sla-template-create.component';
import { SlaAgreementsComponent } from './sla-agreements/sla-agreements.component';
import { SlaAgreementsDetailComponent } from './sla-agreements-detail/sla-agreements-detail.component';
import { SlaViolationsComponent } from './sla-violations/sla-violations.component';
import { SliceTemplateListComponent } from './slice-template-list/slice-template-list.component';
import { SliceTemplateCreateComponent } from './slice-template-create/slice-template-create.component';
import { SliceTemplateDetailComponent } from './slice-template-detail/slice-template-detail.component';
import { SliceInstanceListComponent } from './slice-instance-list/slice-instance-list.component';
import { SliceInstanceDetailComponent } from './slice-instance-detail/slice-instance-detail.component';
import { SliceInstanceCreateComponent } from './slice-instance-create/slice-instance-create.component';

@NgModule({
	declarations: [
		SpPackagesComponent,
		SpPackagesDetailComponent,
		SpNetworkServicesComponent,
		SpNetworkServicesDetailComponent,
		SpFunctionsDetailComponent,
		PlacementPolicyComponent,
		RuntimePoliciesComponent,
		RuntimePoliciesDetailComponent,
		RuntimePoliciesCreateComponent,
		RuntimePoliciesGeneratedActionsComponent,
		SlaTemplateListComponent,
		SlaTemplateDetailComponent,
		SlaTemplateCreateComponent,
		SlaAgreementsComponent,
		SlaAgreementsDetailComponent,
		SlaViolationsComponent,
		SliceTemplateListComponent,
		SliceTemplateCreateComponent,
		SliceTemplateDetailComponent,
		SliceInstanceListComponent,
		SliceInstanceDetailComponent,
		SliceInstanceCreateComponent
	],
	entryComponents: [],
	imports: [
		CommonModule,
		AngularMaterialModule,
		AppRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		SharedModule
	],
	providers: [ ServicePlatformService ]
})
export class ServicePlatformModule { }
