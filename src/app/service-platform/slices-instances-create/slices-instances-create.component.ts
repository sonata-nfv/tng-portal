import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-slices-instances-create',
	templateUrl: './slices-instances-create.component.html',
	styleUrls: [ './slices-instances-create.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SlicesInstancesCreateComponent implements OnInit {
	loading: boolean;
	instantiationForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<SlicesInstancesCreateComponent>,
		private servicePlatformService: ServicePlatformService,
		private utilsService: UtilsService
	) { }

	ngOnInit() {
		this.instantiationForm = new FormGroup({
			nsiName: new FormControl(null, Validators.required),
			nsiDescription: new FormControl(null, Validators.required)
		});
	}

	async instantiate() {
		const instance = {
			nst_id: this.data.nstId,
			name: this.instantiationForm.get('nsiName').value,
			description: this.instantiationForm.get('nsiDescription').value,
			'request_type': 'CREATE_SLICE'
		};

		this.loading = true;
		const response = await this.servicePlatformService.postOneSliceInstance(instance);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Slice template ' + response[ 'name' ] + ' instantiating...', '');
		} else {
			this.utilsService.openSnackBar('There was an error instantiating the sclice template', '');
		}
		this.close();
	}

	close() {
		this.dialogRef.close();
	}
}
