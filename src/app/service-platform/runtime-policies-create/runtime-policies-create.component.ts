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
	openedMonitoringRuleForm = true;
	policyForm: FormGroup;
	monitoringRulesForm: FormGroup;
	policyRulesForm: FormGroup;
	disabledButton = true;
	nsList = new Array();
	slaList = new Array();
	conditions = new Array();
	monitoringRules = new Array();
	conditionRulesSelected = new Array();

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
			vendor: new FormControl('', Validators.required),
			version: new FormControl('', Validators.required),
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

		this.policyRulesForm = new FormGroup({
			name: new FormControl('', Validators.required),
			salience: new FormControl('', Validators.required),
			inertia: new FormControl('', Validators.required),
			inertiaUnit: new FormControl('', Validators.required),
			condition: new FormControl('', Validators.required),
			conditionRules: new FormControl('', Validators.required),
			// actions: new FormControl('', Validators.required)
		});

		this.policyForm.valueChanges.subscribe(value => this.onPolicyFormChanges(value));
	}

	// TODO review when save must be active
	private onPolicyFormChanges(value?) {
		if (this.policyForm.get('ns').value && this.policyForm.get('name').value) {
			this.disabledButton = false;
		}
		// TODO check if rule was added through description edit with change in
		// policy form monitoringRules and generate new conditionRules
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

	receivePolicyRule(name) {
		let rules: Array<Object>;
		const vnf_name = this.monitoringRules.find(item => item.uuid === name).vnfName;
		const rule = {
			id: vnf_name,
			field: vnf_name,
			value: name
		};

		if (this.policyRulesForm.get('conditionRules').value) {
			rules = this.getParsedJSON(this.policyRulesForm.get('conditionRules').value);
		} else {
			rules = [];
		}
		// Save rule to display and remove it from monitoring rules displayed
		this.conditionRulesSelected.push(rule);
		this.monitoringRules = this.monitoringRules.filter(item => item.name !== name);
		console.log(this.monitoringRules);
		console.log(this.monitoringRules.length);

		// Save rule in the form to send
		rules.push(rule);
		this.policyRulesForm.get('conditionRules').setValue(this.getStringifiedJSON(rules));
	}

	eraseConditionRule(rule) {
		this.conditionRulesSelected = this.conditionRulesSelected.filter(item => item[ 'value' ] !== rule.value);

		this.monitoringRules.push({
			uuid: rule.value,
			name: rule.value,
			vnfName: rule.id
		});
	}

	addNewMonitoringRule() {
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

		// TODO generate policy rules from monitoring ones checking
		// that they were not already selected in
		// conditionRulesSelected
		this.generatePolicyRuleValues(rules);
	}

	private generatePolicyRuleValues(rules) {
		this.monitoringRules = rules.map(cond => {
			const vnfName = cond.name.split(':')[ 0 ];
			return {
				uuid: cond.name.replace(/:/g, '_'),
				name: cond.name.replace(/:/g, '_'),
				vnfName: vnfName
			};
		});
	}

	addNewPolicyRule() {
		// TODO add new policy rule and reset form or only reset form
		// "name": "ElasticityRuleScaleIn",
		// "salience": 1,
		// "inertia": {
		// 	"value": 30,
		// 	"duration_unit": "m"
		// },
		// "conditions": {
		// 	"condition": "AND", ---> coming from policyRulesForm.get('condition')
		// 	"rules": [{ --> comming from policyRulesForm.get('conditionRules')
		// 		"id": NOT SENDING THIS , //here just put the vnf name (eg. haproxy-vnf) . I will add the "LogMetric"
		// 		"field": NOT SENDING THIS , //here just put the vnf name (eg. haproxy-vnf) . I will add the "LogMetric"
		// 		"type": NOT SENDING THIS ,  // for the moment is always "string". do not send it. i can fill it up.
		// 		"input": NOT SENDING THIS , // for the moment is always "text". do not send it. i can fill it up.
		// 		"operator": NOT SENDING THIS , // for the moment is always "equal". do not send it. i can fill it up.
		// 		"value": "haproxy_vnf_vdu01_haproxy_backend_sespsrv_more150"
		// 	}]
		// },
		// "actions": [{
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

	canDisableAddNewMonitoring() {
		return !this.monitoringRulesForm.valid;
	}

	canShowMonitoring() {
		return (this.policyForm.get('ns').value && this.conditions.length);
	}

	canShowPolicyRules() {
		return true; // TODO change this comments
		// return this.policyForm.get('monitoringRules').value.length &&
		// this.utilsService.isValidJSON(this.policyForm.get('monitoringRules').value);
	}

	canDisableAddNewPolicyRule() {
		return !this.policyRulesForm.valid;
	}

	closeMonitoringRuleForm() {
		this.openedMonitoringRuleForm = false;
		this.monitoringRulesForm.reset();
	}

	closePolicyRuleForm() {
		this.policyRulesForm.reset();
	}

	generatePolicyObject() {
		const nsObj = this.nsList.find(item => item.uuid === this.policyForm.get('ns').value);
		const ns = {
			vendor: nsObj.vendor,
			name: nsObj.name,
			version: nsObj.version
		};

		const policy = {
			name: this.policyForm.get('name').value,
			networka_service: ns,
			sla: this.policyForm.get('sla').value,
			default_policy: this.policyForm.get('default').value,
			monitoring_rules: this.policyForm.get('monitoringRules').value,
			conditions: {
				condition: 'AND',
				rules: [ {
					'value': 'haproxy_vnf_vdu01_haproxy_backend_sespsrv_more150'
				} ]
			},
			// 	policyRules: [],
		};



		// "actions": [{  WORKING ON THIS.....
		// 	"action_object": NOT SENDING THIS , // Please add two options here : ElasticityAction or SecurityAction
		// 	"action_type": "ScalingType", -> WILL SEND PREDEFINED VALUES FROM PORTAL (i.e. scale in/out) unless there is an API with different types // do not send it . i can fill it up.
		// 	"name": NOT SENDING THIS , // in case the action_object is ElasticityAction, the options should be addvnf or removevnf . In case the action_object is SecurityAction the options should be enableFirewall or alertMessage
		// 	"value": "1",
		// 	"target": {
		// 		"name": "squid-vnf",
		// 		"vendor": "eu.5gtango",
		// 		"version": "0.2"
		// 	}
		// }]
	}

	createPolicy() {


		// console.log(policy);

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
