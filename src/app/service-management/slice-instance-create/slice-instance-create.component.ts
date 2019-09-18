import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ServiceManagementService } from '../service-management.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-slice-instance-create',
	templateUrl: './slice-instance-create.component.html',
	styleUrls: [ './slice-instance-create.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SliceInstanceCreateComponent implements OnInit {
	loading: boolean;
	instantiationForm: FormGroup;
	slas = new Array<object>();
	step = 'first';

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<SliceInstanceCreateComponent>,
		private serviceManagementService: ServiceManagementService,
		private utilsService: UtilsService,
		private commonService: CommonService
	) { }

	ngOnInit() {
		this.getSLAs();
		this.instantiationForm = new FormGroup({
			nsiName: new FormControl(null, Validators.required),
			nsiDescription: new FormControl(null, Validators.required)
		});
	}

	private async getSLAs() {
		this.loading = true;
		const ns = this.data.networkServices.map(item => item[ 'nsd-ref' ]);
		const templates = await this.commonService.getSLATemplates();

		this.loading = false;
		// Save online the SLAs related to the slice network services
		templates && templates.length ?
			this.slas = templates.filter(item => ns.includes(item[ 'nsUUID' ]))
			: this.step = 'sla-error';

		if (!this.slas.length) {
			this.step = 'sla-error';
		}
	}

	getSLAForService(uuid) {
		return this.slas.filter(sla => sla[ 'nsUUID' ] === uuid);
	}

	async instantiate() {
		// TODO send parameters
		// const slasForServices: [
		// 	{
		// 		service_uuid: uuid, //--> (nsd_ref is the ns uuid),
		// 		sla_name: name,
		// 		sla_uuid
		// 	}
		// ];
		const instance = {
			nst_id: this.data.nstId,
			name: this.instantiationForm.get('nsiName').value,
			description: this.instantiationForm.get('nsiDescription').value,
			'request_type': 'CREATE_SLICE',
			// services_sla: slasForServices
		};

		this.loading = true;
		const response = await this.serviceManagementService.postOneSliceInstance(instance);

		this.loading = false;
		response ?
			this.utilsService.openSnackBar('Slice template ' + response[ 'name' ] + ' instantiating...', '')
			: this.utilsService.openSnackBar('There was an error instantiating the sclice template', '');

		this.close();
	}

	receiveSLA(nsUUID, slaUUID) {
		// TODO find slaName with sla UUID
		// TODO create array of objects with the nsUUID, slaUUID and slaName
	}

	chooseBackStep() {
		this.step = this.slas.length ? 'first' : 'sla-error';
	}

	close() {
		this.dialogRef.close();
	}
}
