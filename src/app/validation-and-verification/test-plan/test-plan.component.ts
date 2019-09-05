import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-test-plan',
	templateUrl: './test-plan.component.html',
	styleUrls: [ './test-plan.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class TestPlanComponent implements OnInit {
	loading: boolean;
	testPlan = { };
	result: object;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.requestTestPlan(params[ 'id' ]);
		});
	}

	async requestTestPlan(uuid) {
		this.loading = true;
		const testPlan = await this.verificationAndValidationPlatformService.getOneTestPlan(uuid);

		if (testPlan) {
			this.testPlan = testPlan;

			if (testPlan.testResultUuid) {
				const result = await this.verificationAndValidationPlatformService.getTestResults(testPlan.testResultUuid);
				this.result = result ? result : { };
			}
		} else {
			this.utilsService.openSnackBar('Unable to fetch the test plan', '');
			this.close();
		}

		this.loading = false;
	}

	async confirmExecution() {
		this.loading = true;
		const uuid = this.testPlan[ 'uuid' ];
		const status = this.testPlan[ 'status' ] === 'WAITING_FOR_CONFIRMATION' ? 'SCHEDULED' : 'RETRIED';

		const response = await this.verificationAndValidationPlatformService.putNewTestPlanStatus(uuid, status);

		this.loading = false;
		response ?
			this.utilsService.openSnackBar('The test plan was executed', '')
			: this.utilsService.openSnackBar('Unable to execute the test plan', '');
	}

	async cancelExecution() {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.deleteTestPlan(this.testPlan[ 'uuid' ]);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('The test plan was cancelled', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('Unable to cancel the test plan', '');
		}
	}

	canShowExecute() {
		return this.testPlan[ 'uuid' ] && this.testPlan[ 'required' ] &&
			(this.testPlan[ 'status' ] === 'CANCELLED' || this.testPlan[ 'status' ] === 'ERROR');
	}

	canShowCancelExecution() {
		return this.testPlan[ 'status' ] === 'PENDING' || this.testPlan[ 'status' ] === 'NOT_CONFIRMED'
			|| this.testPlan[ 'status' ] === 'STARTING' || this.testPlan[ 'status' ] === 'SCHEDULED';
	}

	canShowRequiredConfirmation() {
		return this.testPlan[ 'required' ] && this.testPlan[ 'status' ] === 'WAITING_FOR_CONFIRMATION';
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	copyJSONToClipboard(json) {
		this.utilsService.copyToClipboard(this.stringifyJSON(json));
	}

	stringifyJSON(json) {
		return JSON.stringify(json);
	}

	openService() {
		this.router.navigate([ `validation-and-verification/network-services/${ this.testPlan[ 'serviceUUID' ] }` ]);
	}

	openTest() {
		this.router.navigate([ `validation-and-verification/tests/${ this.testPlan[ 'testUUID' ] }` ]);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
