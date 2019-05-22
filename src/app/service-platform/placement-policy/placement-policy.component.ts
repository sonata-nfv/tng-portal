import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-placement-policy',
	templateUrl: './placement-policy.component.html',
	styleUrls: [ './placement-policy.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class PlacementPolicyComponent implements OnInit {
	loading = false;
	placementPolicies: Array<string>;
	placementPolicyForm: FormGroup;
	prioritiseForm: FormGroup;
	disabledButton = false;
	show = false;
	prioritise = false;
	datacenters = new Array();
	datacentersSelected = new Array();
	error: boolean;


	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService,
	) { }

	ngOnInit() {
		this.initForm();

		// TODO GET placement policies from a service
		this.placementPolicies = [ 'None', 'Load Balanced', 'Prioritise', 'Fill First' ];
	}

	private initForm() {
		this.placementPolicyForm = new FormGroup({
			placementPolicy: new FormControl()
		});

		this.prioritiseForm = new FormGroup({
			datacenter: new FormControl()
		});

		this.placementPolicyForm.valueChanges.subscribe(value =>
			this.onFormChangesPolicy(value)
		);
	}

	private onFormChangesPolicy(values) {
		this.show = true;
		this.prioritise = values.placementPolicy === 'Prioritise' ? true : false;

		if (this.prioritise) {
			this.getEndpoints();
			this.disabledButton = true;
		} else {
			this.disabledButton = false;
		}
	}

	private async getEndpoints() {
		this.loading = true;
		const datacenters = await this.commonService.getEndpoints();

		this.loading = false;
		if (datacenters) {
			this.datacenters = datacenters;
		} else {
			this.utilsService.openSnackBar('Unable to fetch datacenters', '');
			this.datacenters.unshift({ uuid: 'None', name: 'None' });
		}
	}

	receivePlacementPolicy(policy) {
		this.placementPolicyForm.get('placementPolicy').setValue(policy);
		this.error = false;
	}

	receiveDatecenter(datacenter) {
		this.prioritiseForm.get('datacenter').setValue(datacenter);
	}

	addMore() {
		this.error = this.prioritiseForm.controls.datacenter.value ? false : true;

		if (!this.error) {
			const datacenterID = this.prioritiseForm.get('datacenter').value;
			const datacenter = this.datacenters.find(item => item.uuid === datacenterID);
			this.datacentersSelected.push(datacenter);

			// Remove datacenter from the select list offered
			this.datacenters = this.datacenters.filter(item => item.uuid !== datacenterID);

			this.prioritiseForm.reset();
		}

		this.disabledButton = this.datacentersSelected.length ? false : true;
	}

	eraseEntry(datacenter) {
		this.datacentersSelected = this.datacentersSelected.filter(item => item.uuid !== datacenter.uuid);
		this.datacenters.push(datacenter);

		this.disabledButton = this.datacentersSelected.length ? false : true;
	}

	canReset() {
		return !this.placementPolicyForm.get('placementPolicy').value;
	}

	canShowAddMore() {
		return this.prioritise && this.datacenters.length;
	}

	canShow() {
		// TODO check if the chosen datacenter is different from
		// the option saved in the begining
		// disableButton if both are the same ? warning ?
		return this.show;
	}

	cancel() {
		if (this.prioritise) {
			this.prioritiseForm.reset();
			this.datacentersSelected = new Array();
		}

		this.placementPolicyForm.reset();
		this.error = false;
	}

	save() {
		// TODO Save request to catalog
		console.log(this.placementPolicyForm.controls.placementPolicy.value);
		console.log(this.datacentersSelected);
	}
}
