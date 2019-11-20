import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { AppRoutingModule } from '../app-routing.module';

import { ServiceManagementService } from './service-management.service';

import { SmSliceTemplateDetailComponent } from './sm-slice-template-detail/sm-slice-template-detail.component';
import { SmSliceTemplateListComponent } from './sm-slice-template-list/sm-slice-template-list.component';
import { SliceInstanceListComponent } from './slice-instance-list/slice-instance-list.component';
import { SliceInstanceDetailComponent } from './slice-instance-detail/slice-instance-detail.component';
import { SliceInstanceCreateComponent } from './slice-instance-create/slice-instance-create.component';
import { SmNetworkServicesComponent } from './sm-network-services/sm-network-services.component';
import { SmNetworkServicesDetailComponent } from './sm-network-services-detail/sm-network-services-detail.component';
import { NsInstantiateDialogComponent } from './ns-instantiate-dialog/ns-instantiate-dialog.component';
import { CustomInstantiationParametersComponent } from './custom-instantiation-parameters/custom-instantiation-parameters.component';
import { NapListsComponent } from './nap-lists/nap-lists.component';
import { NsInstanceListComponent } from './ns-instance-list/ns-instance-list.component';
import { NsInstanceDetailComponent } from './ns-instance-detail/ns-instance-detail.component';
import { ScaleOutComponent } from './ns-instance-detail/scale-out.component';
import { VnfRecordDetailComponent } from './vnf-record-detail/vnf-record-detail.component';
import { CnfRecordDetailComponent } from './cnf-record-detail/cnf-record-detail.component';
import { GraphDialogComponent } from './graph-dialog/graph-dialog.component';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { LicenceListComponent } from './license-list/license-list.component';
import { LicenceDetailComponent } from './license-detail/license-detail.component';

@NgModule({
	declarations: [
		SmSliceTemplateListComponent,
		SmSliceTemplateDetailComponent,
		SliceInstanceListComponent,
		SliceInstanceDetailComponent,
		SliceInstanceCreateComponent,
		SmNetworkServicesComponent,
		SmNetworkServicesDetailComponent,
		NsInstantiateDialogComponent,
		CustomInstantiationParametersComponent,
		NapListsComponent,
		NsInstanceListComponent,
		NsInstanceDetailComponent,
		ScaleOutComponent,
		VnfRecordDetailComponent,
		CnfRecordDetailComponent,
		GraphDialogComponent,
		RequestListComponent,
		RequestDetailComponent,
		LicenceListComponent,
		LicenceDetailComponent
	],
	entryComponents: [
		NsInstantiateDialogComponent,
		GraphDialogComponent
	],
	imports: [
		CommonModule,
		AngularMaterialModule,
		AppRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		SharedModule
	],
	providers: [ ServiceManagementService ]
})
export class ServiceManagementModule { }
