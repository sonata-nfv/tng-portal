import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { UtilsService } from '../../shared/services/common/utils.service';
import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';

@Component({
	selector: 'app-execute-test-dialog',
	templateUrl: './execute-test-dialog.component.html',
	styleUrls: [ './execute-test-dialog.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class ExecuteTestDialogComponent implements OnInit {
	loading: boolean;
	testExecutionForm: FormGroup;
	policies: Array<object>;

	constructor(
		private router: Router,
		private utilsService: UtilsService,
		public dialogRef: MatDialogRef<ExecuteTestDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.initForms();
		this.getData();
	}

	private initForms() {
		this.testExecutionForm = new FormGroup({
			platformName: new FormControl(),
			policy: new FormControl(),
			confirmRequired: new FormControl(),
			executionHost: new FormControl()
		});
	}

	private async getData() {
		this.loading = true;
		const policies = await this.verificationAndValidationPlatformService.getTestPlansPolicies();

		this.loading = false;
		policies ? this.policies = policies : this.utilsService.openSnackBar('Unable to fetch any policy', '');
	}

	receivePolicy(uuid) {
		const platformName = this.policies.find(policy => policy[ 'uuid' ] === uuid)[ 'platformName' ];
		this.testExecutionForm.get('policy').setValue(uuid);
		this.testExecutionForm.get('platformName').setValue(platformName);
	}

	changeConfirmRequired(value) {
		this.testExecutionForm.get('confirmRequired').setValue(value);
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
		return this.policies && this.policies.length;
	}

	close() {
		this.dialogRef.close();
	}
}
