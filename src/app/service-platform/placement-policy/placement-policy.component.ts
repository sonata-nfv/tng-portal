import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { DialogDataService } from '../../shared/services/dialog/dialog.service';
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
	placementPolicyForm: FormGroup;
	prioritiseForm: FormGroup;
	error: boolean;
	show = false;
	resetPolicy = false;
	resetDatacenter = false;
	requested = false;
	prioritise = false;

	// TODO GET placement policies from a service
	placementPolicies = [ 'None', 'Load Balanced', 'Prioritise', 'Fill First' ];
	datacenters = new Array();
	datacentersSelected = new Array();

	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService,
		private dialogData: DialogDataService
	) { }

	ngOnInit() {
		this.initForm();
	}

	private initForm() {
		this.placementPolicyForm = new FormGroup({
			placementPolicy: new FormControl()
		});
		this.prioritiseForm = new FormGroup({
			datacenter: new FormControl()
		});
		this.placementPolicyForm.valueChanges.subscribe(value =>
			this._onFormChangesPolicy(value)
		);
	}

	private _onFormChangesPolicy(values) {
		this.show = values.placementPolicy !== null ? true : false;
		this.prioritise = values.placementPolicy === 'Prioritise' ? true : false;

		if (this.prioritise && !this.requested) {
			this.requested = true;
			this.getEndpoints();
		}
	}

	private async getEndpoints() {
		const datacenters = await this.commonService.getEndpoints();

		if (datacenters) {
			// TODO GET location names and map them to uuid to be sent
			this.datacenters = datacenters.map(item => item.uuid);
		} else {
			this.utilsService.openSnackBar('Unable to fetch datacenters', '');
			this.datacenters = [];
		}
	}

	save() {
		if (
			this.datacentersSelected.length < 1 &&
			this.placementPolicyForm.controls.placementPolicy.value === 'Prioritise'
		) {
			const title = 'oh oh...';
			const content =
				'Please, select at least one datacenter for this placement policy.';
			const action = 'Accept';
			this.dialogData.openDialog(title, content, action, () => { });
		} else {
			// TODO Save request to catalog
			console.log(this.placementPolicyForm.controls.placementPolicy.value);
			console.log(this.datacentersSelected);
		}
	}

	cancel() {
		if (this.prioritise) {
			this.prioritiseForm.reset();
			this.resetDatacenter = true;
			setTimeout(() => {
				this.resetDatacenter = false;
			}, 5);

			this.datacenters = this.datacenters.concat(this.datacentersSelected);
			this.datacentersSelected = new Array();
		}

		this.placementPolicyForm.reset();
		this.resetPolicy = true;
		setTimeout(() => {
			this.resetPolicy = false;
		}, 5);
	}

	addMore() {
		this.error =
			this.prioritiseForm.controls.datacenter.value !== null ? false : true;

		if (!this.error) {
			this.datacentersSelected.push(
				this.prioritiseForm.controls.datacenter.value
			);
			this.datacenters = this.datacenters.filter(
				x => x !== this.prioritiseForm.controls.datacenter.value
			);

			this.resetDatacenter = true;
		}
	}

	receivePlacementPolicy($event) {
		this.placementPolicyForm.controls.placementPolicy.setValue($event);
	}

	receiveDatecenter($event) {
		this.prioritiseForm.controls.datacenter.setValue($event);
	}

	eraseEntry(item) {
		this.datacentersSelected = this.datacentersSelected.filter(x => x !== item);
		this.datacenters.push(item);
	}
}
