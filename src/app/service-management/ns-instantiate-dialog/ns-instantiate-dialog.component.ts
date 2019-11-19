import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ServiceManagementService } from '../service-management.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';
import { LocationNap } from '../nap-lists/nap-lists.component';

@Component({
	selector: 'app-ns-instantiate-dialog',
	templateUrl: './ns-instantiate-dialog.component.html',
	styleUrls: [ './ns-instantiate-dialog.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class NsInstantiateDialogComponent implements OnInit {
	loading: boolean;
	instantiationIsAllowed = true;
	section = 'location-nap';
	instantiationForm: FormGroup;
	slas: Array<any>;
	ingress = new Array<LocationNap>();
	egress = new Array<LocationNap>();
	blacklist = new Array<LocationNap>();
	customParameters: Array<object>;

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
			sla: new FormControl(),
			instanceName: new FormControl(null, Validators.required)
		});
	}

	private async getData() {
		this.loading = true;
		const templates = await this.commonService.getSLATemplates();

		this.loading = false;
		if (templates) {
			// GET SLA templates for this service
			this.slas = templates.filter(x => x.nsUUID === this.data.serviceUUID).map(x => ({ uuid: x.uuid, name: x.name, license: x.license }));
			// If no SLA were created for the NS, there are no licenses associated
			this.instantiationIsAllowed = this.slas.length ? false : true;
		} else {
			this.utilsService.openSnackBar('Unable to fetch SLA templates', '');
		}
	}

	receiveList(listObject) {
		switch (listObject.listName) {
			case 'ingress':
				this.ingress = listObject.list;
				break;
			case 'egress':
				this.egress = listObject.list;
				break;
			case 'blacklist':
				this.blacklist = listObject.list;
				break;
		}
	}

	receiveSLA(sla) {
		if (sla && sla !== this.instantiationForm.get('sla').value) {
			this.instantiationForm.get('sla').setValue(sla);
			this.checkLicenseValidity(sla);
		}
	}

	receiveCustomParameters(list) {
		this.customParameters = list;
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

		if (this.customParameters && this.customParameters.length) {
			body[ 'params' ] = this.customParameters;
		}

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
			this.section = 'naming';
			this.checkLicenseValidity(sla);
		} else {
			this.utilsService.openSnackBar('Unable to buy the license, try again please', '');
		}
	}

	canShowLoading() {
		return this.loading && this.section !== 'location-nap';
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
