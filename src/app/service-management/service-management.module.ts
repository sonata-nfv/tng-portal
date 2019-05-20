import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { AppRoutingModule } from '../app-routing.module';

import { ServiceManagementService } from './service-management.service';

import { SliceInstanceListComponent } from './slice-instance-list/slice-instance-list.component';
import { SliceInstanceDetailComponent } from './slice-instance-detail/slice-instance-detail.component';
import { SliceInstanceCreateComponent } from './slice-instance-create/slice-instance-create.component';
import { SmNetworkServicesComponent } from './sm-network-services/sm-network-services.component';
import { SmNetworkServicesDetailComponent } from './sm-network-services-detail/sm-network-services-detail.component';
import { NsInstantiateDialogComponent } from './ns-instantiate-dialog/ns-instantiate-dialog.component';
import { NetworkServiceInstancesComponent } from './network-service-instances/network-service-instances.component';
import { NetworkServiceInstancesDetailComponent } from './network-service-instances-detail/network-service-instances-detail.component';
import { VnfRecordDetailComponent } from './vnf-record-detail/vnf-record-detail.component';
import { CnfRecordDetailComponent } from './cnf-record-detail/cnf-record-detail.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { LicenceListComponent } from './license-list/license-list.component';
import { LicenceDetailComponent } from './license-detail/license-detail.component';

@NgModule({
	declarations: [
		SliceInstanceListComponent,
		SliceInstanceDetailComponent,
		SliceInstanceCreateComponent,
		SmNetworkServicesComponent,
		SmNetworkServicesDetailComponent,
		NsInstantiateDialogComponent,
		NetworkServiceInstancesComponent,
		NetworkServiceInstancesDetailComponent,
		VnfRecordDetailComponent,
		CnfRecordDetailComponent,
		RequestsComponent,
		RequestDetailComponent,
		LicenceListComponent,
		LicenceDetailComponent
	],
	entryComponents: [ NsInstantiateDialogComponent ],
	imports: [ CommonModule, AngularMaterialModule, AppRoutingModule, ReactiveFormsModule, FormsModule, SharedModule ],
	providers: [ ServiceManagementService ]
})
export class ServiceManagementModule { }
