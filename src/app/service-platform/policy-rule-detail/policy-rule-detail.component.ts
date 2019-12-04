import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
	selector: 'app-policy-rule-detail',
	templateUrl: './policy-rule-detail.component.html',
	styleUrls: [ './policy-rule-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class PolicyRuleDetailComponent implements OnInit {
	@Input() policyRule: Object;
	displayedColumns = [ 'action', 'type', 'name', 'target', 'value' ];
	actions: Array<Object>;
	conditions: Array<Object>;
	conditionOperator: string;

	constructor() { }

	ngOnInit() {
		this.actions = this.policyRule[ 'actions' ];
		this.conditions = this.policyRule[ 'conditions' ][ 'rules' ];
		this.conditionOperator = this.policyRule[ 'conditions' ][ 'condition' ];
	}

	canShowConditionOperator(index) {
		return this.policyRule[ 'conditions' ][ 'rules' ].length > 1 && index !== (this.policyRule[ 'conditions' ][ 'rules' ].length - 1);
	}
}
