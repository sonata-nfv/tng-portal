import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { ValidationAndVerificationPlatformService } from './validation-and-verification.service';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { TestPlanListComponent } from './test-plan-list/test-plan-list.component';
import { TestPlanComponent } from './test-plan/test-plan.component';
import { TestsComponent } from './tests/tests.component';
import { TestsDetailComponent } from './tests-detail/tests-detail.component';
import { VnvPackagesComponent } from './vnv-packages/vnv-packages.component';
import { VnvPackagesDetailComponent } from './vnv-packages-detail/vnv-packages-detail.component';
import { VnvNetworkServicesComponent } from './vnv-network-services/vnv-network-services.component';
import { VnvNetworkServicesDetailComponent } from './vnv-network-services-detail/vnv-network-services-detail.component';
import { AnalyticResultListComponent } from './analytic-result-list/analytic-result-list.component';
import { AnalyticProcessCreateComponent } from './analytic-process-create/analytic-process-create.component';
import { AnalyticResultComponent } from './analytic-result/analytic-result.component';
import { ExecuteTestDialogComponent } from './execute-test-dialog/execute-test-dialog.component';

@NgModule({
	declarations: [
		TestPlanListComponent,
		TestPlanComponent,
		TestsComponent,
		TestsDetailComponent,
		VnvPackagesComponent,
		VnvPackagesDetailComponent,
		VnvNetworkServicesComponent,
		VnvNetworkServicesDetailComponent,
		AnalyticResultListComponent,
		AnalyticProcessCreateComponent,
		AnalyticResultComponent,
		ExecuteTestDialogComponent,
	],
	entryComponents: [
		ExecuteTestDialogComponent,
	],
	imports: [
		CommonModule,
		AngularMaterialModule,
		ReactiveFormsModule,
		FormsModule,
		NgxJsonViewerModule,
		AppRoutingModule,
		SharedModule,
	],
	providers: [ ValidationAndVerificationPlatformService ]
})
export class ValidationAndVerificationModule { }
