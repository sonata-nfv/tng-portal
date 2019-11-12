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
	vims = new Array<object>();
	vimValue: string;
	slaValue: string;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<SliceInstanceCreateComponent>,
		private serviceManagementService: ServiceManagementService,
		private utilsService: UtilsService,
		private commonService: CommonService
	) { }

	ngOnInit() {
		this.getData();
		this.instantiationForm = new FormGroup({
			nsiName: new FormControl(null, Validators.required),
			nsiDescription: new FormControl(null, Validators.required)
		});

		this.populateInstantiationParameters();
	}

	private populateInstantiationParameters() {
		this.data.networkServices.forEach(ns => {
			const instantiationParameter = new InstantiationParameter();
			instantiationParameter.subnetID = ns.id;
			instantiationParameter.nsID = ns[ 'nsd-ref' ];
			instantiationParameter.nsName = ns[ 'nsd-name' ];
			instantiationParameter.egresses = new Array<LocationNap>();
			instantiationParameter.ingresses = new Array<LocationNap>();
			this.instantiationParameters.push(instantiationParameter);
		});
	}

	private async getData() {
		this.loading = true;
		const networkServices = this.data.networkServices.map(item => item[ 'nsd-ref' ]);
		const templates = await this.commonService.getSLATemplates();
		const vims = await this.commonService.getVims();

		this.loading = false;
		// Save only the SLAs related to the network services of the slice
		templates && templates.length ?
			this.slas = templates.filter(item => networkServices.includes(item[ 'nsUUID' ]))
			: this.step = 'warning';

		vims && vims.length ?
			this.vims = vims
			: this.step = 'warning';

		if (!this.slas.length || !this.vims.length) {
			this.step = 'warning';
		}
	}

	getSLAForService() {
		return this.slas.filter(sla => sla[ 'nsUUID' ] === this.instantiationParameters[ this.networkServiceIterator ].nsID);
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

	receiveSlaPerNS(slaUUID) {
		const slaName = this.slas.find(item => item[ 'uuid' ] === slaUUID)[ 'name' ];
		this.instantiationParameters[ this.networkServiceIterator ].slaID = slaUUID;
		this.instantiationParameters[ this.networkServiceIterator ].slaName = slaName;
		this.slaValue = slaUUID;
	}

	receiveVimPerNS(vimUUID) {
		this.instantiationParameters[ this.networkServiceIterator ].vimID = vimUUID;
		this.vimValue = vimUUID;
	}

	chooseBackStep() {
		if (this.step === 'last') {
			this.step = 'network-services-config';
		} else if (this.step === 'network-services-config' && this.networkServiceIterator) {
			this.networkServiceIterator -= 1;
			this.vimValue = this.instantiationParameters[ this.networkServiceIterator ].vimID;
			this.slaValue = this.instantiationParameters[ this.networkServiceIterator ].slaID;
		} else {
			this.step = this.slas.length ? 'intro' : 'warning';
		}
	}

	chooseForwardStep() {
		if (this.step === 'intro' || this.step === 'warning') {
			this.step = 'network-services-config';
		} else if (this.data.networkServices[ this.networkServiceIterator + 1 ]) {
			this.networkServiceIterator += 1;
			this.vimValue = this.instantiationParameters[ this.networkServiceIterator ].vimID;
			this.slaValue = this.instantiationParameters[ this.networkServiceIterator ].slaID;
		} else {
			this.step = 'last';
		}
	}

	canShowLoading() {
		return this.loading && this.step !== 'network-services-config';
	}

	canShowErrorSLAs() {
		return this.step === 'warning' && !this.slas.length;
	}

	canShowErrorVIMs() {
		return this.step === 'warning' && !this.vims.length;
	}

	// TODO disable instantiate if sla is missing
	// check this using instantiationParameters array. NS with no SLA must not be in the sla list
	async instantiate() {
		this.loading = true;
		const instance = {
			nst_id: this.data.nstId,
			name: this.instantiationForm.get('nsiName').value,
			description: this.instantiationForm.get('nsiDescription').value,
			'request_type': 'CREATE_SLICE',
			instantiation_parameters: this.instantiationParameters.map(item => {
				const mappedObject = {
					subnet_id: item.subnetID,
				};
				if (item.slaID && item.slaName) {
					mappedObject[ 'sla_name' ] = item.slaName;
					mappedObject[ 'sla_id' ] = item.slaID;
				}
				if (item.vimID) {
					mappedObject[ 'vim_id' ] = item.vimID;
				}
				if (item.ingresses.length) {
					mappedObject[ 'ingresses' ] = item.ingresses.map(o => ({ location: o.location, nap: o.nap }));
				}
				if (item.egresses.length) {
					mappedObject[ 'egresses' ] = item.egresses.map(o => ({ location: o.location, nap: o.nap }));
				}
				return mappedObject;
			})
		};

		const response = await this.serviceManagementService.postOneSliceInstance(instance);

		this.loading = false;
		response ?
			this.utilsService.openSnackBar('Slice template ' + response[ 'name' ] + ' instantiating...', '')
			: this.utilsService.openSnackBar('There was an error instantiating the slice template', '');

		this.close();
	}

	close() {
		this.dialogRef.close();
	}
}
