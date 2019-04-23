import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-runtime-policies-create',
	templateUrl: './runtime-policies-create.component.html',
	styleUrls: [ './runtime-policies-create.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesCreateComponent implements OnInit {
	loading = false;
	reset = false;
	policyForm: FormGroup;
	disabledButton = true;
	closed = true;
	nsList = new Array();
	nsListComplete = new Array();
	monitoringRules = 'This is a monitoring rule for this example!';

	constructor(
		private router: Router,
		private utilsService: UtilsService,
		private commonService: CommonService,
		private servicePlatformService: ServicePlatformService
	) { }

	ngOnInit() {
		this.initForms();
		this.getData();
	}

	private initForms() {
		this.policyForm = new FormGroup({
			name: new FormControl(),
			default: new FormControl(),
			ns: new FormControl('', Validators.required),
			monitoringRule: new FormControl()
		});

		this.policyForm.valueChanges.subscribe(value => this._onFormChanges(value));
	}

	private _onFormChanges(value?) {
		if (
			this.policyForm.get('ns').value != null &&
			this.policyForm.get('name').value != null
		) {
			this.disabledButton = false;
		}
	}

	private async getData() {
		this.loading = true;
		const response = await this.commonService.getNetworkServices('SP');

		this.loading = false;
		if (response) {
			// Save NS data to display
			this.nsList = response.map(x => x.name);

			// Save complete data from NS
			this.nsListComplete = response;
		} else {
			this.nsList.push('None');
			this.utilsService.openSnackBar('Unable to fetch network services', '');
		}
	}

	receiveNS(ns) {
		let ns_uuid: string;

		if (ns === 'None') {
			this.policyForm.controls.ns.setValue(null);
			ns_uuid = null;
		} else {
			ns_uuid = this.nsListComplete.filter(x => x.name === ns)[ 0 ].serviceId;
			this.policyForm.controls.ns.setValue(ns_uuid);
		}
	}

	createPolicy() {
		const policy = {
			vendor: '5GTANGO',
			name: this.policyForm.get('name').value,
			version: '0.1',
			network_service: this.policyForm.get('ns').value,
			default_policy: this.policyForm.get('default').value,
			policyRules: [],
			monitoringRules: this.policyForm.get('monitoringRule').value
		};

		this.loading = true;
		this.servicePlatformService
			.postOneRuntimePolicy(policy)
			.then(response => {
				this.loading = false;
				this.close();
			})
			.catch(err => {
				this.loading = false;
				// TODO display request status in toast
			});
	}

	close() {
		this.router.navigate([ 'service-platform/policies/runtime-policies' ]);
	}
}
