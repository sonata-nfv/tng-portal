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
		// TODO include ns with their slas in the form / request
		this.instantiationForm = new FormGroup({
			nsiName: new FormControl(null, Validators.required),
			nsiDescription: new FormControl(null, Validators.required)
		});

		console.log(this.data);
	}

	private async getSLAs() {
		this.loading = true;
		const templates = await this.commonService.getSLATemplates();

		this.loading = false;
		templates && templates.length ? this.slas = templates : this.step = 'sla-error';
	}

	async instantiate() {
		const instance = {
			nst_id: this.data.nstId,
			name: this.instantiationForm.get('nsiName').value,
			description: this.instantiationForm.get('nsiDescription').value,
			'request_type': 'CREATE_SLICE'
		};

		this.loading = true;
		const response = await this.serviceManagementService.postOneSliceInstance(instance);

		this.loading = false;
		response ?
			this.utilsService.openSnackBar('Slice template ' + response[ 'name' ] + ' instantiating...', '')
			: this.utilsService.openSnackBar('There was an error instantiating the sclice template', '');

		this.close();
	}

	receiveSLA(sla) {

	}

	chooseBackStep() {
		this.step = this.slas.length ? 'first' : 'sla-error';
	}

	close() {
		this.dialogRef.close();
	}
}
