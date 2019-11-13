import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { ServicePlatformService } from '../service-platform.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';

@Component({
	selector: 'app-placement-policy',
	templateUrl: './placement-policy.component.html',
	styleUrls: [ './placement-policy.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class PlacementPolicyComponent implements OnInit {
	loading = false;
	error: boolean;
	errorInSave = false;
	prioritise = false;
	originalPolicy: string;
	originalDatacenters: Array<string>;
	placementPolicies: Array<string>;
	placementPolicyForm: FormGroup;
	prioritiseForm: FormGroup;
	datacenters = new Array();
	datacentersSelected = new Array();


	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService,
		private dialogData: DialogDataService,
		private servicePlatformService: ServicePlatformService
	) { }

	ngOnInit() {
		this.initForm();
		this.requestPlacement();
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

	private async requestPlacement() {
		this.loading = true;
		const placement = await this.servicePlatformService.getPlacementPolicy();

		this.loading = false;
		if (placement) {
			this.originalPolicy = placement[ 'policy' ] ? placement[ 'policy' ] : 'None';
			this.placementPolicyForm.get('placementPolicy').setValue(this.originalPolicy);

			if (this.originalPolicy === 'Prioritise') {
				this.originalDatacenters = placement[ 'datacenters' ];
			}
		} else {
			this.utilsService.openSnackBar('Unable to fetch the actual placement policy', '');
		}
	}

	private onFormChangesPolicy(values) {
		this.prioritise = values.placementPolicy === 'Prioritise' ? true : false;

		if (this.prioritise) {
			this.getEndpoints();
		}
	}

	private async getEndpoints() {
		this.loading = true;
		const datacenters = await this.commonService.getEndpoints();

		this.loading = false;
		if (datacenters.length) {
			this.datacenters = datacenters;

			// If Prioritise policy, store the datacenters selected and remove them from the offered list
			if (this.originalPolicy === 'Prioritise') {
				this.originalDatacenters.forEach(uuid => {
					this.datacentersSelected.push(this.datacenters.find(item => item.uuid === uuid));
					this.datacenters = this.datacenters.filter(item => item.uuid !== uuid);
				});
			}
		} else {
			const title = 'Oh oh...';
			const content = 'No datacenters were found this time. Please, choose another placement policy or try again later.';
			const action = 'Accept';

			this.dialogData.openDialog(title, content, action, async () => { });
		}
	}

	receivePlacementPolicy(policy) {
		if (policy !== this.placementPolicyForm.get('placementPolicy').value) {
			this.placementPolicyForm.get('placementPolicy').setValue(policy);
			this.error = false;
			this.errorInSave = false;
		}
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
	}

	eraseEntry(datacenter) {
		this.datacentersSelected = this.datacentersSelected.filter(item => item.uuid !== datacenter.uuid);
		this.datacenters.push(datacenter);
	}

	movePossitionInArray(oldIndex, newIndex) {
		if (newIndex >= this.datacentersSelected.length) {
			let k = newIndex - this.datacentersSelected.length;
			while ((k--) + 1) {
				this.datacentersSelected.push(undefined);
			}
		}
		this.datacentersSelected.splice(newIndex, 0, this.datacentersSelected.splice(oldIndex, 1)[ 0 ]);
		return;
	}

	canDisableSave() {
		const newPolicy = this.placementPolicyForm.get('placementPolicy').value;

		if (newPolicy && this.originalPolicy !== newPolicy) {
			return newPolicy === 'Prioritise' && !this.datacentersSelected.length ? true : false;
		} else {
			return true;
		}
	}

	canShowAlreadySaved() {
		const newPolicy = this.placementPolicyForm.get('placementPolicy').value;

		return this.originalPolicy && this.originalPolicy === newPolicy ? true : false;
	}

	canResetDatacenterSelect() {
		return !this.prioritiseForm.get('datacenter').value;
	}

	canShowAddMore() {
		return this.prioritise && this.datacenters.length;
	}

	canShowArrowsUp(index) {
		return this.datacentersSelected.length > 1 && index !== 0;
	}

	canShowArrowsDown(index) {
		return this.datacentersSelected.length > 1 && index !== (this.datacentersSelected.length - 1);
	}

	cancel() {
		if (this.prioritise) {
			this.prioritiseForm.reset();
			this.datacentersSelected = new Array();
		}

		this.placementPolicyForm.get('placementPolicy').setValue(this.originalPolicy);
		this.error = false;
		this.errorInSave = false;
	}

	async save() {
		let placementPolicy: object;
		const policy = this.placementPolicyForm.get('placementPolicy').value;

		policy === 'Prioritise' ?
			placementPolicy = {
				policy: policy,
				datacenters: this.datacentersSelected.map(item => item.uuid)
			}
			: placementPolicy = {
				policy: policy
			};

		this.loading = true;
		const response = await this.servicePlatformService.postPlacementPolicy(placementPolicy);

		this.loading = false;
		if (response) {
			this.errorInSave = false;
			this.utilsService.openSnackBar('New placement policy saved...', '');
			this.requestPlacement();
		} else {
			this.errorInSave = true;
			this.utilsService.openSnackBar('Unable to save the new placement policy', '');
		}
	}
}
