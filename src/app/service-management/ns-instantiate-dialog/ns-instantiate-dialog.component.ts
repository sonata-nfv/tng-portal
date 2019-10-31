import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ServiceManagementService } from '../service-management.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';

@Component({
	selector: 'app-ns-instantiate-dialog',
	templateUrl: './ns-instantiate-dialog.component.html',
	styleUrls: [ './ns-instantiate-dialog.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class NsInstantiateDialogComponent implements OnInit {
	loading: boolean;
	instantiationIsAllowed = true;
	section = 'first';
	listName: string;
	instantiationForm: FormGroup;
	ingress = new Array();
	egress = new Array();
	blacklist = new Array();
	locations: Array<any>;
	slas: Array<any>;

	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService,
		public dialogRef: MatDialogRef<NsInstantiateDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private serviceManagementService: ServiceManagementService,
		private dialogData: DialogDataService
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
			this.slas = templates.filter(x => x.nsUUID === this.data.serviceUUID).map(x => ({ uuid: x.uuid, name: x.name, license: x.license }));
			// If no SLA were created for the NS, there are no licenses associated
			this.instantiationIsAllowed = this.slas.length ? false : true;
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

		switch (this.listName) {
			case 'ingress':
				this.ingress.push(point);
				break;
			case 'egress':
				this.egress.push(point);
				break;
			case 'blacklist':
				this.blacklist.push(point);
				break;
		}

		this.instantiationForm.reset();
	}

	eraseEntry(entry: string) {
		switch (this.listName) {
			case 'ingress':
				this.ingress = this.ingress.filter(x => x !== entry);
				break;
			case 'egress':
				this.egress = this.egress.filter(x => x !== entry);
				break;
			case 'blacklist':
				this.blacklist = this.blacklist.filter(x => x !== entry);
				break;
		}
	}

	receiveListName(listName) {
		this.listName = listName;
	}

	receiveLocation(location) {
		location ?
			this.instantiationForm.get('location').setValue(location) :
			this.instantiationForm.get('location').setValue(null);
	}

	receiveSLA(sla) {
		if (sla && sla !== this.instantiationForm.get('sla').value) {
			this.instantiationForm.get('sla').setValue(sla);
			this.checkLicenseValidity(sla);
		}
	}

	async checkLicenseValidity(slaUUID) {
		// Check if license is valid before instantiate
		const response = await this.serviceManagementService.getLicenseStatus(slaUUID, this.data.serviceUUID);

		if (response) {
			this.instantiationIsAllowed = response[ 'allowed_to_instantiate' ] ? true : false;

			// License does not allow instantiation
			// case license public or trial : case license private
			if (!response[ 'allowed_to_instantiate' ]) {
				response[ 'license_type' ] !== 'private' ?
					this.section = 'error' :
					this.section = 'buy';
			}
		} else {
			const slaObject = this.slas.find(item => item.uuid === slaUUID);
			this.instantiationIsAllowed = slaObject[ 'license' ] === 'public' ?
				true : false;

			// If there is no response regarding license validity and the NS is not public then instantiation is forbidden
			if (!this.instantiationIsAllowed) {
				this.close();
				const title = 'oh oh...';
				const content = 'There was an error checking the validity of the license. As this network service is not public, you are not allowed \
										to instantiate it for the moment. Please, try again later.';
				const action = 'Accept';
				this.dialogData.openDialog(title, content, action, () => { });
			}
		}
	}

	async instantiate(serviceUUID) {
		this.loading = true;
		const body = {
			name: this.instantiationForm.get('instanceName').value,
			ingresses: this.ingress.map(ingress => ({ location: ingress.location, nap: ingress.nap })),
			egresses: this.egress.map(egress => ({ location: egress.location, nap: egress.nap })),
			blacklist: this.blacklist.map(item => ({ location: item.location, nap: item.nap })),
			service_uuid: serviceUUID,
			sla_id: this.instantiationForm.get('sla').value || ''
		};
		const response = await this.serviceManagementService.postOneNSInstance(body);

		this.loading = false;
		response ?
			this.utilsService.openSnackBar('Instantiating ' + response[ 'name' ] + '...', '')
			: this.utilsService.openSnackBar('Unable to instantiate this network service', '');

		this.close();
	}

	async buy() {
		this.loading = true;
		const sla = this.instantiationForm.get('sla').value;
		const license = {
			ns_uuid: this.data.serviceUUID,
			sla_uuid: sla,
		};
		const response = await this.serviceManagementService.postOneLicense(license);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar(response[ 'Succes' ], '');
			this.section = 'second';
			this.checkLicenseValidity(sla);
		} else {
			this.utilsService.openSnackBar('Unable to buy the license, try again please', '');
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

	canDisableInstantiate() {
		return (!this.instantiationForm.get('instanceName').value ||
			this.instantiationForm.get('instanceName').value.trim() === '') ||
			!this.instantiationIsAllowed;
	}

	close() {
		this.dialogRef.close();
	}
}
