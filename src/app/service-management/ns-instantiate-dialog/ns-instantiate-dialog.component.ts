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
	isIngress = true;
	instantiationForm: FormGroup;
	ingress = new Array();
	egress = new Array();
	locations: Array<any>;
	slas: Array<any>;

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
			location: new FormControl(),
			nap: new FormControl(null, Validators.pattern(this.utilsService.getIpAndMaskPattern())),
			sla: new FormControl(),
			instanceName: new FormControl(null, Validators.required)
		});
	}

	private async getData() {
		this.loading = true;
		const templates = await this.commonService.getSLATemplates();
		const endpoints = await this.commonService.getEndpoints();

		this.loading = false;
		if (templates) {
			// GET SLA templates for this service
			this.slas = templates.filter(x => x.nsUUID === this.data.serviceUUID).map(x => ({ uuid: x.uuid, name: x.name }));
			this.slas.unshift({ uuid: 'None', name: 'None' });
		} else {
			this.utilsService.openSnackBar('Unable to fetch SLA templates', '');
		}

		if (endpoints) {
			this.locations = endpoints;
			this.locations.unshift({ uuid: 'None', name: 'None' });

		} else {
			this.utilsService.openSnackBar('Unable to fetch locations', '');
		}
	}

	addNew() {
		const point = {
			location: this.instantiationForm.get('location').value,
			locationName: this.locations.find(location => location.uuid === this.instantiationForm.get('location').value).name,
			nap: this.instantiationForm.get('nap').value
		};

		this.isIngress ? this.ingress.push(point) : this.egress.push(point);
		this.instantiationForm.reset();
	}

	eraseEntry(entry: string) {
		this.isIngress ?
			this.ingress = this.ingress.filter(x => x !== entry) :
			this.egress = this.egress.filter(x => x !== entry);
	}

	receiveLocation(location) {
		location ?
			this.instantiationForm.get('location').setValue(location) :
			this.instantiationForm.get('location').setValue(null);
	}

	receiveSLA(sla) {
		if (sla && sla !== 'None') {
			this.instantiationForm.get('sla').setValue(sla);
		} else {
			this.instantiationForm.get('sla').setValue('');
		}
	}

	async instantiate(serviceUUID) {
		this.loading = true;
		const body = {
			name: this.instantiationForm.get('instanceName').value,
			ingresses: this.ingress.map(ingress => ({ location: ingress.location, nap: ingress.nap })),
			egresses: this.egress.map(egress => ({ location: egress.location, nap: egress.nap })),
			service_uuid: serviceUUID,
			sla_id: this.instantiationForm.get('sla').value
		};
		const response = await this.serviceManagementService.postNSRequest(body);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Instantiating ' + response[ 'name' ] + '...', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('Unable to instantiate this network service', '');
		}

	}

	canShowNetworkAddress() {
		return this.instantiationForm.get('location').value && this.instantiationForm.get('location').value !== 'None' ? true : false;
	}

	canResetSelect() {
		return this.instantiationForm.get('location').value ? false : true;
	}

	canDisableAddNew() {
		return !this.instantiationForm.get('location').value ||
			!this.instantiationForm.get('nap').value ||
			this.instantiationForm.get('nap').errors;
	}

	close() {
		this.dialogRef.close();
	}
}
