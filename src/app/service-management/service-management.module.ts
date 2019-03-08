import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { AppRoutingModule } from '../app-routing.module';

import { ServiceManagementService } from './service-management.service';

import { SmNetworkServicesComponent } from './sm-network-services/sm-network-services.component';
import { SmNetworkServicesDetailComponent } from './sm-network-services-detail/sm-network-services-detail.component';
import { NsInstantiateDialogComponent } from './ns-instantiate-dialog/ns-instantiate-dialog.component';
import { NetworkServiceInstancesComponent } from './network-service-instances/network-service-instances.component';
import { NetworkServiceInstancesDetailComponent } from './network-service-instances-detail/network-service-instances-detail.component';
import { FunctionRecordsDetailComponent } from './function-records-detail/function-records-detail.component';
import { LicencesComponent } from './licenses/licenses.component';
import { LicencesDetailComponent } from './licenses-detail/licenses-detail.component';
import { ServiceLicensesComponent } from './service-licenses/service-licenses.component';
import { UserLicensesComponent } from './user-licenses/user-licenses.component';

@NgModule({
	declarations: [
		SmNetworkServicesComponent,
		SmNetworkServicesDetailComponent,
		NsInstantiateDialogComponent,
		NetworkServiceInstancesComponent,
		NetworkServiceInstancesDetailComponent,
		FunctionRecordsDetailComponent,
		LicencesComponent,
		LicencesDetailComponent,
		ServiceLicensesComponent,
		UserLicensesComponent
	],
	entryComponents: [ NsInstantiateDialogComponent ],
	imports: [ CommonModule, AngularMaterialModule, AppRoutingModule, ReactiveFormsModule, FormsModule, SharedModule ],
	providers: [ ServiceManagementService ]
})
export class ServiceManagementModule { }
