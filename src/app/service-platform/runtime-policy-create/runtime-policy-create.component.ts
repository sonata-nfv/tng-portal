import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import {
	animate,
	state,
	style,
	transition,
	trigger
} from '@angular/animations';

import { CommonService } from '../../shared/services/common/common.service';
import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';

import { CustomDataSource } from '../../shared/components/custom-data-source.component';

@Component({
	selector: 'app-runtime-policy-create',
	templateUrl: './runtime-policy-create.component.html',
	styleUrls: [ './runtime-policy-create.component.scss' ],
	encapsulation: ViewEncapsulation.None,
	animations: [
		trigger('detailExpand', [
			state(
				'collapsed',
				style({
					display: 'none',
					transform: 'rotateX(90deg)'
				})
			),
			state('expanded', style({ })),
			transition('collapsed => expanded', animate('300ms ease-in'))
		])
	]
})
export class RuntimePolicyCreateComponent implements OnInit {
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
	policyRuleActions = [ 'Elasticity Action', 'Alert Action' ];
	elasticityActionOptions = [ 'Add VNF', 'Remove VNF' ];
	alertActionOptions = [ 'Intrusion' ];
	policyRuleActionNames: Array<string>;
	vnfs: Array<string>;
	displayedActionColumns = [ 'actionObject', 'name', 'value', 'target', 'delete' ];
	displayedRuleColumns = [ 'name', 'salience', 'inertia', 'delete' ];
	actionsDataSource = new MatTableDataSource;
	policyRulesDataSource = new CustomDataSource();
	thresholds = [ { uuid: '>', name: 'greater' }, { uuid: '=', name: 'equal' }, { uuid: '<', name: 'less' } ];
	durationUnits: Array<object>;
	// Policy duplication params
	duplicatingPolicy: boolean;
	@ViewChild('slaSelect') slaSelect;
	@ViewChild('nsSelect') nsSelect;

	isExpansionDetailRow = (i: number, row: Object) =>
		row.hasOwnProperty('detailRow')

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
		this.durationUnits = this.utilsService.getDurationUnits();

		// Check if this is creation or duplication of a policy
		if (this.router.url.includes('service-platform/policies/runtime-policies/duplicate')) {
			this.duplicatingPolicy = true;

			this.route.params.subscribe(params => {
				const uuid = params[ 'id' ];
				this.requestRuntimePolicy(uuid);
			});
		} else {
			this.duplicatingPolicy = false;
		}
	}

	private initForms() {
		this.policyForm = new FormGroup({
			vendor: new FormControl('', Validators.required),
			version: new FormControl('', Validators.required),
			name: new FormControl('', Validators.required),
			default: new FormControl(false),
			ns: new FormControl('', Validators.required),
			sla: new FormControl(),
			monitoringRules: new FormControl('', Validators.required),
			policyRules: new FormControl([], Validators.required)
		});

		this.monitoringRulesForm = new FormGroup({
			description: new FormControl('', Validators.required),
			duration: new FormControl('', Validators.pattern(this.utilsService.getNumberPattern())),
			durationUnit: new FormControl('', Validators.required),
			threshold: new FormControl('', Validators.required),
			thresholdValue: new FormControl('', Validators.pattern(this.utilsService.getNumberPattern())),
			condition: new FormControl('', Validators.required)
		});

		this.policyRulesForm = new FormGroup({
			name: new FormControl('', Validators.required),
			salience: new FormControl('', Validators.required),
			inertia: new FormControl('', Validators.pattern(this.utilsService.getNumberPattern())),
			inertiaUnit: new FormControl('', Validators.required),
			condition: new FormControl('', Validators.required),
			conditionRules: new FormControl([], Validators.required),
			actions: new FormControl([], Validators.required)
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

	async requestRuntimePolicy(uuid) {
		this.loading = true;
		const runtimePolicy = await this.servicePlatformService.getOneRuntimePolicy(uuid);

		if (runtimePolicy) {
			this.populateForms(runtimePolicy);
		} else {
			this.utilsService.openSnackBar('Unable to fetch the runtime policy data', '');
			this.close();
		}
	}

	private populateForms(policy) {
		this.policyForm.get('name').setValue(policy.name);
		this.policyForm.get('default').setValue(policy.default);
		this.policyForm.get('vendor').setValue(policy.vendor);
		this.policyForm.get('version').setValue(policy.version);
		this.receiveNS(policy.nsUUID);
		this.nsSelect.value = policy.nsUUID;
		this.policyForm.get('sla').setValue(policy.slaUUID);
		this.slaSelect.value = policy.slaUUID;
		this.policyForm.get('monitoringRules').setValue(this.getStringifiedJSON(policy.monitoringRules));
		this.openedMonitoringRuleForm = false;
		this.policyForm.get('policyRules').setValue(policy.policyRules);
		this.policyRulesDataSource.data = policy.policyRules;
		this.loading = false;
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
		if (slas && slas.length) {
			this.slaList = slas.map(sla => ({ uuid: sla.uuid, name: sla.name }));
		} else {
			this.slaList.push({ uuid: 'None', name: 'None' });
			this.utilsService.openSnackBar('Unable to fetch SLA templates', '');
		}
	}

	private async getConditionsForService(nsUUID) {
		const monitoringMetrics = await this.servicePlatformService.getMonitoringMetrics(nsUUID);

		if (monitoringMetrics && monitoringMetrics.length) {
			this.conditions = monitoringMetrics;
		} else {
			this.informError(1);
		}
	}

	private async getVNFPerService(nsUUID) {
		const ns = await this.commonService.getOneNetworkService('SP', nsUUID);

		(ns && ns.vnf) ?
			this.vnfs = ns.vnf.map(item => item.vnf_vendor + ':' + item.vnf_name + ' ' + item.vnf_version)
			: this.informError(1);
	}

	receiveNS(nsUUID) {
		if (nsUUID && nsUUID !== 'None') {
			this.loading = true;
			this.policyForm.get('ns').setValue(nsUUID);
			this.conditions = new Array();
			this.getVNFPerService(nsUUID);
			this.getConditionsForService(nsUUID);
			this.loading = false;
		} else {
			this.policyForm.get('ns').setValue(null);
		}

		// Reset introduced data for the previous network service
		this.monitoringRulesForm.reset();
		this.resetPolicyRulesForm();
		this.policyForm.get('monitoringRules').setValue('');
		this.policyForm.get('policyRules').reset();
		this.policyRulesDataSource.data = [];
	}

	receiveSLA(sla) {
		sla === 'None' ?
			this.policyForm.get('sla').setValue(null) :
			this.policyForm.get('sla').setValue(sla);
	}

	receiveDurationUnit(uuid) {
		this.monitoringRulesForm.get('durationUnit').setValue(uuid);
	}

	receiveCondition(condition) {
		this.monitoringRulesForm.get('condition').setValue(condition);
	}

	receiveThresholdOperator(operator) {
		this.monitoringRulesForm.get('threshold').setValue(operator);
	}

	receiveInertiaUnit(uuid) {
		this.policyRulesForm.get('inertiaUnit').setValue(uuid);
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
			rules = this.policyRulesForm.get('conditionRules').value;
		} else {
			rules = [];
		}

		rules.push(rule);

		// Save rule to display and remove it from monitoring rules displayed
		this.policyRulesForm.get('conditionRules').setValue(rules);
		this.monitoringRules = this.monitoringRules.filter(item => item.uuid !== uuid);
	}

	eraseConditionRule(rule) {
		const conditionRule = this.policyRulesForm.get('conditionRules').value.filter(item => item[ 'value' ] !== rule.value);
		this.policyRulesForm.get('conditionRules').setValue(conditionRule);

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
		this.policyRuleActionNames = action === 'ElasticityAction' ? this.elasticityActionOptions : this.alertActionOptions;
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
		const threshold = this.monitoringRulesForm.get('threshold').value.concat('', this.monitoringRulesForm.get('thresholdValue').value);
		const name = this.monitoringRulesForm.get('condition').value.concat(':', threshold);
		const rule = {
			'name': name,
			'description': this.monitoringRulesForm.get('description').value,
			'duration': parseInt(this.monitoringRulesForm.get('duration').value, 10),
			'duration_unit': this.monitoringRulesForm.get('durationUnit').value,
			'condition': this.monitoringRulesForm.get('condition').value,
			'threshold': threshold
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
		const monitoringRules = this.policyRulesForm.get('conditionRules').value;
		if (monitoringRules && monitoringRules.length) {
			for (const cond of monitoringRules) {
				const filteredResult = this.policyRulesForm.get('conditionRules').value.filter(item => item.uuid !== cond.value);
				this.policyRulesForm.get('conditionRules').setValue(filteredResult);
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
			'value': this.actionsForm.get('actionValue').value.toString(),
			'target': {
				'name': vnfName,
				'vendor': vnfVendor,
				'version': vnfVersion
			}
		};

		if (this.policyRulesForm.get('actions').value) {
			actions = this.policyRulesForm.get('actions').value;
		} else {
			actions = [];
		}

		actions.push(action);
		this.policyRulesForm.get('actions').setValue(actions);
		this.actionsDataSource.data = actions;
		this.resetActionsForm();
		this.isOr = false;
	}

	resetActionsForm() {
		this.actionsForm.reset();
		this.actionsForm.get('actionValue').setValue('1');
	}

	deleteTarget(element) {
		const filteredRules = this.policyRulesForm.get('actions').value.filter(item => item !== element);
		this.policyRulesForm.get('actions').setValue(filteredRules);
		this.actionsDataSource.data = filteredRules;
	}

	addNewPolicyRule() {
		let rules: Array<Object>;
		const rule = {
			'name': this.policyRulesForm.get('name').value.replace(/\s+/g, ''),
			'salience': this.policyRulesForm.get('salience').value,
			'inertia': {
				'value': parseInt(this.policyRulesForm.get('inertia').value, 10),
				'duration_unit': this.policyRulesForm.get('inertiaUnit').value
			},
			'conditions': {
				'condition': this.policyRulesForm.get('condition').value,
				'rules': this.policyRulesForm.get('conditionRules').value
			},
			actions: this.policyRulesForm.get('actions').value
		};

		if (this.policyForm.get('policyRules').value) {
			rules = this.policyForm.get('policyRules').value;
		} else {
			rules = [];
		}

		rules.push(rule);
		this.policyForm.get('policyRules').setValue(rules);
		this.policyRulesDataSource.data = rules;
		this.resetPolicyRulesForm();
	}

	resetPolicyRulesForm() {
		this.policyRulesForm.reset();
		this.setPolicyRuleCondition();
		this.isOr = false;
		this.resetActionsForm();
		this.policyRulesForm.get('actions').setValue([]);
		if (this.policyRulesForm.get('conditionRules').value) {
			this.policyRulesForm.get('conditionRules').value.map(rule => this.eraseConditionRule(rule));
		}
	}

	deletePolicyRule(element) {
		const filteredRules = this.policyForm.get('policyRules').value.filter(item => item !== element);
		this.policyRulesDataSource.data = filteredRules;
		this.policyForm.get('policyRules').setValue(filteredRules);
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
		return !(this.policyForm.valid && this.areMonitoringRulesValid() && this.policyForm.get('policyRules').value.length);
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

	canShowPolicyRulesTable() {
		return this.policyForm.get('policyRules').value && this.policyForm.get('policyRules').value.length &&
			this.policyRulesDataSource.data && this.policyRulesDataSource.data.length;
	}

	canDisableAddNewPolicyRule() {
		return !this.policyRulesForm.valid || !this.policyRulesForm.get('conditionRules').value ||
			!this.policyRulesForm.get('conditionRules').value.length;
	}

	canResetInertiaUnit() {
		return !this.policyRulesForm.get('inertiaUnit').value;
	}

	canShowPolicyRuleActionName() {
		return this.actionsForm.get('actionObject').value ? true : false;
	}

	canShowPolicyRuleActionValue() {
		return this.actionsForm.get('actionObject').value && this.actionsForm.get('actionName').value;
	}

	canShowTableOfActions() {
		return this.policyRulesForm.get('actions').value && this.policyRulesForm.get('actions').value.length;
	}

	canResetActionSelects() {
		return !this.actionsForm.get('actionTarget').value;
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

		const policy = {
			name: this.policyForm.get('name').value,
			vendor: this.policyForm.get('vendor').value,
			version: this.policyForm.get('version').value,
			network_service: ns,
			default_policy: this.policyForm.get('default').value,
			monitoring_rules: this.getParsedJSON(this.policyForm.get('monitoringRules').value),
			policyRules: this.policyForm.get('policyRules').value
		};

		if (this.policyForm.get('sla').value && this.policyForm.get('sla').value !== 'None') {
			policy[ 'sla' ] = this.policyForm.get('sla').value;
		}

		return policy;
	}

	async createPolicy() {
		this.loading = true;
		const policy = this.generatePolicyObject();
		const response = await this.servicePlatformService.postOneRuntimePolicy(policy);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Runtime policy created', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('There was an error creating the runtime policy', '');
		}
	}

	informError(option) {
		const title = 'oh oh...';
		const msg1 = 'There was an error fetching the information required to create a runtime policy. Please, try again later.';
		const msg2 = 'This network service does not allow to create monitoring rules. \
					So you will not be able to create a new policy. \
					Please, try with another.';
		const msg3 = 'This network service does not allow to create monitoring rules. \
					So you will not be able to create a new policy. \
					Please, try again when there is a network service with monitoring rules.';
		let content: string;
		switch (option) {
			case 1:
				content = msg1;
				break;
			case 2:
				content = msg2;
				break;
			case 3:
				content = msg3;
				break;
		}
		const action = 'Accept';

		this.dialogData.openDialog(title, content, action, () => {
			if (option === 1 || option === 3) {
				this.close();
			}
		});
	}

	close() {
		this.router.navigate([ 'service-platform/policies/runtime-policies' ]);
	}
}
