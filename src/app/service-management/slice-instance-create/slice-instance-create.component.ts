import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ServiceManagementService } from '../service-management.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';
import { LocationNap } from '../nap-lists/location-nap';
import { InstantiationParameter } from './instantiation-parameter';

@Component({
	selector: 'app-slice-instance-create',
	templateUrl: './slice-instance-create.component.html',
	styleUrls: [ './slice-instance-create.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SliceInstanceCreateComponent implements OnInit {
	loading: boolean;
	step = 'intro';
	instantiationForm: FormGroup;
	networkServiceIterator = 0;
	instantiationParameters = new Array<InstantiationParameter>();

	slas = new Array<object>();
	slaAssociation = new Array<object>();
	nsWithSLA = 0;

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

		this.populateInstantiationParameters();
	}

	private populateInstantiationParameters() {
		this.data.networkServices.forEach(ns => {
			const instantiationParameter = new InstantiationParameter();
			instantiationParameter.subnet_id = ns.id;
			instantiationParameter.egresses = new Array<LocationNap>();
			instantiationParameter.ingresses = new Array<LocationNap>();
			this.instantiationParameters.push(instantiationParameter);
		});
	}

	private async getSLAs() {
		this.loading = true;
		const networkServices = this.data.networkServices.map(item => item[ 'nsd-ref' ]);
		const templates = await this.commonService.getSLATemplates();

		this.loading = false;
		// Save only the SLAs related to the slice network services
		templates && templates.length ?
			this.slas = templates.filter(item => networkServices.includes(item[ 'nsUUID' ]))
			: this.step = 'sla-warning';

		if (!this.slas.length) {
			this.step = 'sla-warning';
		} else {
			// Count the number of ns with a possible SLA
			let nsUUIDInSLA = this.slas.map(sla => sla[ 'nsUUID' ]);
			nsUUIDInSLA = nsUUIDInSLA.filter((sla, index) => nsUUIDInSLA.indexOf(sla) >= index);
			networkServices.forEach(uuid => nsUUIDInSLA.includes(uuid) ? this.nsWithSLA += 1 : this.nsWithSLA += 0);
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

	getIngresses() {
		return this.instantiationParameters[ this.networkServiceIterator ].ingresses;
	}

	getEgresses() {
		return this.instantiationParameters[ this.networkServiceIterator ].egresses;
	}

	receiveList(listObject) {
		listObject.listName === 'ingress' ?
			this.instantiationParameters[ this.networkServiceIterator ].ingresses = listObject.list
			: this.instantiationParameters[ this.networkServiceIterator ].egresses = listObject.list;
	}

	// TODO when next save all the information of the ns as an object
	receiveSLA(nsID, slaUUID) {
		const slaName = this.slas.find(item => item[ 'uuid' ] === slaUUID)[ 'name' ];
		this.slaAssociation.push({
			service_uuid: nsID,
			sla_name: slaName,
			sla_uuid: slaUUID
		});
	}

	// TODO save previous data from previous ns and display it in the screen when back
	chooseBackStep() {
		if (this.step === 'last') {
			this.step = 'network-services-config';
		} else if (this.step === 'network-services-config' && this.networkServiceIterator) {
			this.networkServiceIterator -= 1;
		} else {
			this.step = this.slas.length ? 'intro' : 'sla-warning';
		}
	}

	chooseForwardStep() {
		if (this.step === 'intro' || this.step === 'sla-warning') {
			this.step = 'network-services-config';
		} else if (this.data.networkServices[ this.networkServiceIterator + 1 ]) {
			this.networkServiceIterator += 1;
		} else {
			this.step = 'last';
		}
	}

	// TODO check this using networkServiceIterator
	canDisableNext() {
		return this.slas.length && this.slaAssociation.length !== this.nsWithSLA ? true : false;
	}

	canShowLoading() {
		return this.loading && this.step !== 'network-services-config';
	}

	close() {
		this.dialogRef.close();
	}
}
