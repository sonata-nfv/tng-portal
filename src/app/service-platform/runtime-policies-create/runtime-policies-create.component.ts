import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';

@Component({
	selector: 'app-runtime-policies-create',
	templateUrl: './runtime-policies-create.component.html',
	styleUrls: [ './runtime-policies-create.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesCreateComponent implements OnInit {
	loading = false;
	reset = false;
	editMonitoringRules = false;
	openedMonitoringRuleForm = false;
	policyForm: FormGroup;
	monitoringRulesForm: FormGroup;
	disabledButton = true;
	nsList = new Array();
	slaList = new Array();
	vnfs: Array<object>;
	conditions = new Array();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private dialogData: DialogDataService,
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
			monitoringRules: new FormControl('', Validators.required)
		});

		this.monitoringRulesForm = new FormGroup({
			name: new FormControl('', Validators.required),
			description: new FormControl('', Validators.required),
			duration: new FormControl('', Validators.required),
			durationUnit: new FormControl('', Validators.required),
			threshold: new FormControl('', Validators.required),
			condition: new FormControl('', Validators.required)
		});

		this.policyForm.valueChanges.subscribe(value => this.onPolicyFormChanges(value));
	}

	private onPolicyFormChanges(value?) {
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

	private async getConditionsForService(nsUUID) {
		const ns = await this.commonService.getOneNetworkService('SP', nsUUID);

		this.loading = true;
		if (ns && ns.vnf) {
			// Store VNF data
			this.vnfs = ns.vnf; // really needed ?????????????

			// Get monitoring parameters per VNF
			const responses = await Promise.all(
				ns.vnf.map(item => {
					const searchString = `?vendor=${ item.vnf_vendor }&name=${ item.vnf_name }&version=${ item.vnf_version }`;
					return this.commonService.getFunctionMonitoringParameters(searchString);
				})
			);

			this.loading = false;
			if (responses) {
				responses.map(response => {
					if (response instanceof Array && response.length) {
						this.conditions = this.conditions.concat(response);
					}
				});

				if (!this.conditions.length) {
					this.informError(2);
				}
			} else {
				this.informError(1);
			}

		} else {
			this.informError(1);
		}
	}

	receiveNS(nsUUID) {
		if (nsUUID !== 'None') {
			this.policyForm.get('ns').setValue(nsUUID);
			this.conditions = new Array();
			this.getConditionsForService(nsUUID);
		} else {
			this.policyForm.get('ns').setValue(null);
		}
	}

	receiveSLA(sla) {
		sla === 'None' ?
			this.policyForm.get('sla').setValue(null) :
			this.policyForm.get('sla').setValue(sla);
	}

	receiveCondition(uuid) {
		const condition = this.conditions.find(cond => cond.uuid === uuid).name;
		this.monitoringRulesForm.get('condition').setValue(condition);
		// Included first part of the name with VNF:VDU:CONDITION
		this.monitoringRulesForm.get('name').setValue(uuid);
	}

	isValidJSON() {
		return this.utilsService.isValidJSON(this.policyForm.get('monitoringRules').value);
	}

	getParsedJSON(value) {
		let parsedJSON;

		try {
			parsedJSON = JSON.parse(value);
		} catch (error) {
			parsedJSON = { };
		}
		return parsedJSON;
	}

	getStringifiedJSON(value) {
		return JSON.stringify(value);
	}

	canDisableAddNew() {
		return !this.monitoringRulesForm.valid;
	}

	canShowContinuation() {
		return (this.policyForm.get('ns').value && this.conditions.length);
	}

	addNew() {
		let rules: Array<Object>;
		const name = this.monitoringRulesForm.get('name').value.concat(':', this.monitoringRulesForm.get('threshold').value.replace(/\s+/g, ''));
		const rule = {
			'name': name,
			'description': this.monitoringRulesForm.get('description').value,
			'duration': this.monitoringRulesForm.get('duration').value,
			'duration_unit': this.monitoringRulesForm.get('durationUnit').value,
			'condition': this.monitoringRulesForm.get('condition').value,
			'threshold': this.monitoringRulesForm.get('threshold').value
		};

		if (this.policyForm.get('monitoringRules').value) {
			rules = this.getParsedJSON(this.policyForm.get('monitoringRules').value);
		} else {
			rules = [];
		}

		rules.push(rule);
		this.policyForm.get('monitoringRules').setValue(this.getStringifiedJSON(rules));

		this.closeMonitoringRuleForm();
	}

	closeMonitoringRuleForm() {
		this.openedMonitoringRuleForm = false;
		this.monitoringRulesForm.reset();
	}

	createPolicy() {
		const policy = {
			name: this.policyForm.get('name').value,
			network_service: this.policyForm.get('ns').value,
			sla: this.policyForm.get('sla').value,
			default_policy: this.policyForm.get('default').value,
			monitoring_rules: this.policyForm.get('monitoringRules').value
			// 	policyRules: [],
		};

		console.log(policy);

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

	informError(option) {
		const title = 'oh oh...';
		const msg1 = 'There was an error fetching the information required to create a runtime policy. Please, try again later.';
		const msg2 = 'This network service does not allow to create monitoring rules. \
					So you will not be able to create a new policy. \
					Please, try with another.';
		const content = option === 1 ? msg1 : msg2;
		const action = 'Accept';

		this.dialogData.openDialog(title, content, action, () => {
			if (option === 1) {
				this.close();
			}
		});
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
