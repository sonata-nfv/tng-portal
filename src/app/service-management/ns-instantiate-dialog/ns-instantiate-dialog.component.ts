import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ServiceManagementService } from '../service-management.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-ns-instantiate-dialog',
	templateUrl: './ns-instantiate-dialog.component.html',
	styleUrls: [ './ns-instantiate-dialog.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class NsInstantiateDialogComponent implements OnInit {
	loading: boolean;
	continue = false;
	reset = false;
	isIngress = true;
	instantiationForm: FormGroup;
	ingress = new Array();
	egress = new Array();
	locations: Array<any>;
	slas = new Array();
	slasWithUUID = new Array();

	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService,
		public dialogRef: MatDialogRef<NsInstantiateDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private serviceManagementService: ServiceManagementService
	) { }

	ngOnInit() {
		this.initForms();
		this.getData();
	}

	private initForms() {
		this.instantiationForm = new FormGroup({
			location: new FormControl(null, Validators.required),
			nap: new FormControl(),
			sla: new FormControl(),
			instanceName: new FormControl()
		});
	}

	private async getData() {
		this.loading = true;
		const templates = await this.commonService.getSLATemplates();
		const endpoints = await this.commonService.getEndpoints();

		this.loading = false;
		if (templates) {
			// GET SLA templates names for this NS
			this.slas = templates.filter(x => x.nsUUID === this.data.serviceUUID).map(x => x.name);
			this.slas.unshift('None');
			// GET SLA templates for this NS
			this.slasWithUUID = templates.filter(x => x.nsUUID === this.data.serviceUUID);
		} else {
			this.utilsService.openSnackBar('Unable to fetch SLA templates', '');
		}

		if (endpoints) {
			// TODO GET location names and map them to uuid to be sent
			this.locations = endpoints.map(item => item.uuid);
			this.locations.unshift('None');
		} else {
			this.utilsService.openSnackBar('Unable to fetch locations', '');
		}
	}

	/**
	 * Saves the introduced ingress/egress points
	 */
	addNew() {
		if (this.isIngress) {
			this.ingress.push({
				location: this.instantiationForm.controls.location.value,
				nap: this.instantiationForm.controls.nap.value
			});
		} else {
			this.egress.push({
				location: this.instantiationForm.controls.location.value,
				nap: this.instantiationForm.controls.nap.value
			});
		}
		this.instantiationForm.reset();
		this.reset = true;
		setTimeout(() => {
			this.reset = false;
		}, 5);
	}

	/**
	 * Removes the selected ingress/egress point from the list
	 *
	 * @param entry Ingress or egress point selected
	 */
	eraseEntry(entry: string) {
		if (this.isIngress) {
			this.ingress = this.ingress.filter(x => x !== entry);
		} else {
			this.egress = this.egress.filter(x => x !== entry);
		}
	}

	receiveLocation(location) {
		if (location && location !== 'None') {
			this.instantiationForm.get('location').setValue(location);
		}
	}

	receiveSLA(sla) {
		if (sla !== 'None') {
			this.instantiationForm.controls.sla.setValue(sla);
		}
	}

	instantiate(serviceUUID) {
		this.close();
		this.serviceManagementService
			.postNSRequest(
				this.instantiationForm.get('instanceName').value,
				serviceUUID,
				this.ingress,
				this.egress,
				this.slasWithUUID
					.filter(x => x.name === this.instantiationForm.controls.sla.value)
					.map(x => x.uuid)[ 0 ]
			)
			.then(response => {
				this.utilsService.openSnackBar(
					'Instantiating ' + response + '...',
					''
				);
			})
			.catch(err => {
				this.utilsService.openSnackBar(err, '');
			});
	}

	close() {
		this.dialogRef.close();
	}
}
