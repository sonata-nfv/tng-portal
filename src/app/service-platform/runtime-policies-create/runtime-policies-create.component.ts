import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
	isOr = false;
	editMonitoringRules = false;
	openedMonitoringRuleForm = true;
	policyForm: FormGroup;
	monitoringRulesForm: FormGroup;
	policyRulesForm: FormGroup;
	actionsForm: FormGroup;
	nsList = new Array();
	slaList = new Array();
	conditions = new Array();
	monitoringRules = new Array();
	conditionRulesSelected = new Array();
	policyRuleActions = [ 'Elasticity Action', 'Security Action' ];
	policyRuleActionNames: Array<string>;
	vnfs: Array<string>;
	actionsStored = new Array();
	policyRulesStored = new Array();
	displayedActionColumns = [ 'actionObject', 'name', 'value', 'target', 'delete' ];
	displayedRuleColumns = [ 'name', 'salience', 'inertia', 'delete' ];

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
		// TODO include checks over fields: if string, if number, if json
		// When check if json remove the unnecessary methods
		this.policyForm = new FormGroup({
			vendor: new FormControl('', Validators.required),
			version: new FormControl('', Validators.required),
			name: new FormControl('', Validators.required),
			default: new FormControl(),
			ns: new FormControl('', Validators.required),
			sla: new FormControl(),
			monitoringRules: new FormControl('', Validators.required),
			policyRules: new FormControl('', Validators.required)
		});

		// TODO include checks over fields: if string, if number, if json
		this.monitoringRulesForm = new FormGroup({
			name: new FormControl('', Validators.required),
			description: new FormControl('', Validators.required),
			duration: new FormControl('', Validators.pattern(this.utilsService.getNumberPattern())),
			durationUnit: new FormControl('', Validators.required),
			threshold: new FormControl('', Validators.required),
			condition: new FormControl('', Validators.required)
		});

		this.policyRulesForm = new FormGroup({
			name: new FormControl('', Validators.required),
			salience: new FormControl('', Validators.required),
			inertia: new FormControl('', Validators.pattern(this.utilsService.getNumberPattern())),
			inertiaUnit: new FormControl('', Validators.required),
			condition: new FormControl('', Validators.required),
			conditionRules: new FormControl('', Validators.required),
			actions: new FormControl('', Validators.required)
		});

		this.actionsForm = new FormGroup({
			actionObject: new FormControl('', Validators.required),
			actionName: new FormControl('', Validators.required),
			actionValue: new FormControl(1, Validators.pattern(this.utilsService.getNumberPattern())),
			actionTarget: new FormControl('', Validators.required)
		});

		this.policyForm.valueChanges.subscribe(value => this.onPolicyFormChanges(value));
	}

	private onPolicyFormChanges(value?) {
		if (this.policyForm.get('monitoringRules').value && this.areMonitoringRulesValid()) {
			const rules = this.getParsedJSON(this.policyForm.get('monitoringRules').value);
			this.generatePolicyRuleValues(rules);
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
			this.loading = false;
			this.informError(1);
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
			// Store target VNFs
			this.vnfs = ns.vnf.map(item => item.vnf_vendor + ':' + item.vnf_name + ' ' + item.vnf_version);

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

		// Reset introduced data for the previous network service
		this.monitoringRulesForm.reset();
		this.policyRulesForm.reset();
		this.policyForm.get('monitoringRules').setValue('');
		this.policyForm.get('policyRules').setValue('');

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

	receivePolicyRuleCondition(uuid) {
		let rules: Array<Object>;
		const vnf_name = this.monitoringRules.find(item => item.uuid === uuid).vnfName;
		const rule = {
			id: vnf_name,
			field: vnf_name,
			value: uuid
		};

		if (this.policyRulesForm.get('conditionRules').value) {
			rules = this.getParsedJSON(this.policyRulesForm.get('conditionRules').value);
		} else {
			rules = [];
		}
		// Save rule to display and remove it from monitoring rules displayed
		this.conditionRulesSelected.push(rule);
		this.monitoringRules = this.monitoringRules.filter(item => item.uuid !== uuid);

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

	changePolicyRuleCondition() {
		this.isOr = !this.isOr;
		this.setPolicyRuleCondition();
	}

	private setPolicyRuleCondition() {
		const condition = this.isOr ? 'OR' : 'AND';
		this.policyRulesForm.get('condition').setValue(condition);
	}

	receivePolicyRuleAction(action) {
		action = action.replace(/\s+/g, '');
		this.actionsForm.get('actionObject').setValue(action);

		// Set the policy rule action names for this policy rule action object
		this.policyRuleActionNames = action === 'ElasticityAction' ?
			[ 'Add VNF', 'Remove VNF' ] : [ 'Enable Firewall', 'Alert Message' ];
	}

	receivePolicyRuleActionName(name) {
		name = name.replace(/\s+/g, '').toLowerCase();
		this.actionsForm.get('actionName').setValue(name);
	}

	receivePolicyRuleTarget(target) {
		this.actionsForm.get('actionTarget').setValue(target);
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

		this.generatePolicyRuleValues(rules);
		this.setPolicyRuleCondition();
	}

	private generatePolicyRuleValues(rules) {
		this.monitoringRules = rules.map(cond => {
			const vnfName = cond.name.split(':')[ 0 ];
			const ruleName = cond.name.replace(/:/g, '_');
			return {
				uuid: ruleName,
				name: ruleName,
				vnfName: vnfName
			};
		});

		// If there are some already selected, remove them from the new list
		if (this.conditionRulesSelected.length) {
			for (const cond of this.conditionRulesSelected) {
				this.monitoringRules = this.monitoringRules.filter(item => item.uuid !== cond.value);
			}
		}
	}

	addNewPolicyRuleAction() {
		let actions: Array<Object>;
		const actionTarget = this.actionsForm.get('actionTarget').value;
		const vnfVendor = actionTarget.split(':')[ 0 ];
		const vnfVersion = actionTarget.split(' ')[ 1 ];
		const vnfName = actionTarget.substring(
			actionTarget.lastIndexOf(':') + 1,
			actionTarget.lastIndexOf(' ')
		);

		const action = {
			'action_object': this.actionsForm.get('actionObject').value,
			'name': this.actionsForm.get('actionName').value,
			'value': this.actionsForm.get('actionValue').value,
			'target': {
				'name': vnfName,
				'vendor': vnfVendor,
				'version': vnfVersion
			}
		};

		if (this.policyRulesForm.get('actions').value) {
			actions = this.getParsedJSON(this.policyRulesForm.get('actions').value);
		} else {
			actions = [];
		}

		actions.push(action);
		this.actionsStored = actions;
		this.policyRulesForm.get('actions').setValue(this.getStringifiedJSON(actions));
		this.resetActionsForm();
	}

	resetActionsForm() {
		this.actionsForm.reset();
		this.actionsForm.get('actionValue').setValue(1);
	}

	deleteTarget(element) {
		this.actionsStored = this.actionsStored.filter(item => item !== element);
		this.policyRulesForm.get('actions').setValue(this.getStringifiedJSON(this.actionsStored));
	}

	addNewPolicyRule() {
		let rules: Array<Object>;
		const rule = {
			'name': this.policyRulesForm.get('name').value.replace(/\s+/g, ''),
			'salience': this.policyRulesForm.get('salience').value,
			'inertia': {
				'value': this.policyRulesForm.get('inertia').value,
				'duration_unit': this.policyRulesForm.get('inertiaUnit').value
			},
			'conditions': {
				'condition': this.policyRulesForm.get('condition').value,
				'rules': this.policyRulesForm.get('conditionRules').value
			},
			actions: this.policyRulesForm.get('actions').value
		};

		if (this.policyForm.get('policyRules').value) {
			rules = this.getParsedJSON(this.policyForm.get('policyRules').value);
		} else {
			rules = [];
		}

		rules.push(rule);
		this.policyRulesStored = rules;
		this.policyForm.get('policyRules').setValue(this.getStringifiedJSON(rules));
		this.resetPolicyRulesForm();
	}

	resetPolicyRulesForm() {
		this.policyRulesForm.reset();
		this.resetActionsForm();
		this.actionsStored = new Array();
		this.conditionRulesSelected.map(rule => this.eraseConditionRule(rule));
	}

	deletePolicyRule(element) {
		this.policyRulesStored = this.policyRulesStored.filter(item => item !== element);
		this.policyForm.get('policyRules').setValue(this.getStringifiedJSON(this.policyRulesStored));
	}

	areMonitoringRulesValid() {
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

	canDisableSave() {
		return !(this.policyForm.valid && this.areMonitoringRulesValid() && this.policyRulesStored.length);
	}

	canDisableAddNewMonitoring() {
		return !this.monitoringRulesForm.valid;
	}

	canDisableAddNewAction() {
		return !this.actionsForm.get('actionObject').value || !this.actionsForm.get('actionName').value
			|| !this.actionsForm.get('actionValue').value || !this.actionsForm.get('actionTarget').value
			|| this.actionsForm.get('actionValue').hasError('pattern');
	}

	canShowMonitoringSection() {
		return (this.policyForm.get('ns').value && this.conditions.length);
	}

	canShowPolicyRules() {
		return this.policyForm.get('monitoringRules').value.length &&
			this.utilsService.isValidJSON(this.policyForm.get('monitoringRules').value);
	}

	canDisableAddNewPolicyRule() {
		return !this.policyRulesForm.valid;
	}

	canShowPolicyRuleActionName() {
		return this.actionsForm.get('actionObject').value ? true : false;
	}

	canShowPolicyRuleActionValue() {
		return this.actionsForm.get('actionObject').value && this.actionsForm.get('actionName').value;
	}

	inertiaErrorExists() {
		return this.policyRulesForm.get('inertia').hasError('pattern');
	}

	valueErrorExists() {
		return this.actionsForm.get('actionValue').hasError('pattern');
	}

	closeMonitoringRuleForm() {
		this.openedMonitoringRuleForm = false;
		this.monitoringRulesForm.reset();
	}

	generatePolicyObject() {
		const nsObj = this.nsList.find(item => item.uuid === this.policyForm.get('ns').value);
		const ns = {
			vendor: nsObj.vendor,
			name: nsObj.name,
			version: nsObj.version
		};

		return {
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
			policyRules: this.policyForm.get('policyRules').value
		};
	}

	async createPolicy() {
		this.loading = true;
		const policy = this.generatePolicyObject();
		// const response = await this.servicePlatformService.postOneRuntimePolicy(policy);

		console.log('saving');
		console.log(policy);


		// this.loading = false;
		// if (response) {
		// 		// TODO display request status in toast
		// 		this.close();
		// } else {
		// 		// TODO display request status in toast
		// 	}
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
