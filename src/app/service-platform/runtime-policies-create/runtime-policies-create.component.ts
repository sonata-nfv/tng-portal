import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
	slaList = new Array();
	monitoringRules = 'This is a monitoring rule for this example!';

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private commonService: CommonService,
		private servicePlatformService: ServicePlatformService
	) { }

	ngOnInit() {
		this.initForms();

		this.getNS();
		this.getSLA();
	}

	private initForms() {
		this.policyForm = new FormGroup({
			name: new FormControl('', Validators.required),
			default: new FormControl(),
			ns: new FormControl('', Validators.required),
			sla: new FormControl(),
			monitoringRule: new FormControl()
		});

		this.policyForm.valueChanges.subscribe(value => this._onFormChanges(value));
	}

	private _onFormChanges(value?) {
		if (this.policyForm.get('ns').value && this.policyForm.get('name').value) {
			this.disabledButton = false;
		}
	}

	private async getNS() {
		this.loading = true;
		const networkServices = await this.commonService.getNetworkServices('SP');

		if (networkServices) {
			this.nsList = networkServices.map(ns =>
				({ uuid: ns.uuid, name: ns.name, vendor: ns.vendor, version: ns.version })
			);
		} else {
			this.nsList.push({ uuid: 'None', name: 'None', vendor: '', version: '' });
			this.utilsService.openSnackBar('Unable to fetch network services', '');
		}
	}

	private async getSLA() {
		const slas = await this.commonService.getSLATemplates();

		this.loading = false;
		if (slas) {
			this.slaList = slas.map(sla => ({ uuid: sla.uuid, name: sla.name }));
		} else {
			this.slaList.push({ uuid: 'None', name: 'None' });
			this.utilsService.openSnackBar('Unable to fetch SLA templates', '');
		}
	}

	receiveNS(ns) {
		ns === 'None' ?
			this.policyForm.controls.ns.setValue(null) :
			this.policyForm.controls.ns.setValue(ns);
	}

	receiveSLA(sla) {
		sla === 'None' ?
			this.policyForm.controls.ns.setValue(null) :
			this.policyForm.controls.ns.setValue(sla);
	}




	createPolicy() {
		// const policy = {
		// 	vendor: '5GTANGO',
		// 	name: this.policyForm.get('name').value,
		// 	version: '0.1',
		// 	network_service: this.policyForm.get('ns').value,
		// 	default_policy: this.policyForm.get('default').value,
		// 	policyRules: [],
		// 	monitoringRules: this.policyForm.get('monitoringRule').value
		// };

		// console.log(policy)

		// this.loading = true;
		// this.servicePlatformService
		// 	.postOneRuntimePolicy(policy)
		// 	.then(response => {
		// 		this.loading = false;
		// 		this.close();
		// 	})
		// 	.catch(err => {
		// 		this.loading = false;
		// 		// TODO display request status in toast
		// 	});
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
