import { Component, OnInit, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { UtilsService } from '../../shared/services/common/utils.service';
import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';

interface InputData {
	section: string;
	uuid: string;
	name: string;
	policiesEnabled: boolean;
}

@Component({
	selector: 'app-execute-test-dialog',
	templateUrl: './execute-test-dialog.component.html',
	styleUrls: [ './execute-test-dialog.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class ExecuteTestDialogComponent implements OnInit {
	@ViewChild('platformsSelect') platformsSelect;
	loading: boolean;
	testExecutionForm: FormGroup;
	policies: Array<object>;
	platforms: Array<string>;

	constructor(
		private router: Router,
		private utilsService: UtilsService,
		public dialogRef: MatDialogRef<ExecuteTestDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: InputData,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService,
	) { }

	ngOnInit() {
		this.initForms();
		this.getPlatforms();
		if (this.data.policiesEnabled) {
			this.getPolicies();
		}
	}

	private initForms() {
		this.testExecutionForm = new FormGroup({
			platformName: new FormControl(),
			policy: new FormControl(),
			confirmRequired: new FormControl(),
			executionHost: new FormControl(),
		});
	}

	private async getPolicies() {
		this.loading = true;
		const policies = await this.verificationAndValidationPlatformService.getTestPlansPolicies();

		this.loading = false;
		policies ?
			this.policies = policies.filter(policy => policy[ 'nsUUID' ] === this.data.uuid)
			: this.utilsService.openSnackBar('Unable to fetch any policy', '');
	}

	private async getPlatforms() {
		this.loading = true;
		const platforms = await this.verificationAndValidationPlatformService.getPlatformNames();

		this.loading = false;
		platforms ?
			this.platforms = platforms
			: this.utilsService.openSnackBar('Unable to fetch any platform', '');
	}

	receivePolicy(uuid) {
		const platformName = this.policies.find(policy => policy[ 'uuid' ] === uuid)[ 'platformName' ];
		this.testExecutionForm.get('policy').setValue(uuid);
		this.testExecutionForm.get('platformName').setValue(platformName);
		this.platforms = this.platforms.filter(platform => platform === platformName);
		this.platformsSelect.value = platformName;
	}

	receivePlatform(platformName) {
		this.testExecutionForm.get('platformName').setValue(platformName);
		if (this.policies) {
			this.policies = this.policies.filter(policy => policy[ 'platformName' ] === platformName);
		}
	}

	changeConfirmRequired(value) {
		// If true, then confirm required is false and it gets executed automatically
		this.testExecutionForm.get('confirmRequired').setValue(!value);
	}

	async createTestPlans() {
		this.loading = true;
		const platformName = this.testExecutionForm.get('platformName').value;
		const policyUUID = this.testExecutionForm.get('policy').value;
		const confirmRequired = this.testExecutionForm.get('confirmRequired').value || false;
		const executionHost = this.testExecutionForm.get('executionHost').value;

		const response = await this.verificationAndValidationPlatformService.postTestPlans(
			this.data.section, this.data.uuid, confirmRequired, policyUUID, platformName, executionHost);

		this.loading = false;
		if (response) {
			this.router.navigate([ 'validation-and-verification/test-plans' ]);
			this.utilsService.openSnackBar('Creating test plan...', '');
		} else {
			this.data.section === 'tests' ?
				this.utilsService.openSnackBar('Unable to execute this test', '')
				: this.utilsService.openSnackBar('Unable to execute this set of tests', '');
		}

		this.close();
	}

	canShowPolicies() {
		return this.policies && this.policies.length && this.data.policiesEnabled;
	}

	canShowPlatforms() {
		return this.platforms && this.platforms.length;
	}

	close() {
		this.dialogRef.close();
	}
}
