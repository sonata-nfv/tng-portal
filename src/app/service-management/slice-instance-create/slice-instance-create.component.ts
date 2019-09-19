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
	slaAssociation = new Array<object>();
	nsWithSLA = 0;
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
		} else {
			// Count the number of ns with a possible SLA
			let nsUUIDInSLA = this.slas.map(sla => sla[ 'nsUUID' ]);
			nsUUIDInSLA = nsUUIDInSLA.filter((sla, index) => nsUUIDInSLA.indexOf(sla) >= index);
			ns.filter(uuid => nsUUIDInSLA.includes(uuid) ? this.nsWithSLA += 1 : this.nsWithSLA += 0);
		}
	}

	getSLAForService(uuid) {
		return this.slas.filter(sla => sla[ 'nsUUID' ] === uuid);
	}

	async instantiate() {
		const instance = {
			nst_id: this.data.nstId,
			name: this.instantiationForm.get('nsiName').value,
			description: this.instantiationForm.get('nsiDescription').value,
			'request_type': 'CREATE_SLICE',
			services_sla: this.slaAssociation.length ? this.slaAssociation : []
		};

		this.loading = true;
		const response = await this.serviceManagementService.postOneSliceInstance(instance);

		this.loading = false;
		response ?
			this.utilsService.openSnackBar('Slice template ' + response[ 'name' ] + ' instantiating...', '')
			: this.utilsService.openSnackBar('There was an error instantiating the slice template', '');

		this.close();
	}

	receiveSLA(nsID, slaUUID) {
		const slaName = this.slas.find(item => item[ 'uuid' ] === slaUUID)[ 'name' ];
		this.slaAssociation.push({
			service_uuid: nsID,
			sla_name: slaName,
			sla_uuid: slaUUID
		});
	}

	chooseBackStep() {
		this.step = this.slas.length ? 'first' : 'sla-error';
	}

	canDisableNext() {
		return this.slas.length && this.slaAssociation.length !== this.nsWithSLA ? true : false;
	}

	close() {
		this.dialogRef.close();
	}
}
