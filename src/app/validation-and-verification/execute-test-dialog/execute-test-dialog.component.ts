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
			sp: new FormControl(),
			policy: new FormControl(),
			confirmRequired: new FormControl()
		});
	}

	private async getData() {
		this.loading = true;
		// TODO get sps and policies
	}

	// TODO include policy and sp to the request body
	async createTestPlans() {
		this.loading = true;
		const confirmRequired = this.testExecutionForm.get('confirmRequired').value || false;
		const response = await this.verificationAndValidationPlatformService.postTestPlans(this.data.section, this.data.uuid, confirmRequired);

		this.loading = false;
		if (response) {
			this.router.navigate([ 'validation-and-verification/test-plans' ]);
		} else {
			this.data.section === 'tests' ?
				this.utilsService.openSnackBar('Unable to execute this test', '')
				: this.utilsService.openSnackBar('Unable to execute this set of tests', '');
		}

		this.close();
	}

	close() {
		this.dialogRef.close();
	}
}
