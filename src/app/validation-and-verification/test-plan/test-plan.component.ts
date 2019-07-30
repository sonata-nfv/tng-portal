import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-test-plan',
	templateUrl: './test-plan.component.html',
	styleUrls: [ './test-plan.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class TestPlanComponent implements OnInit {
	loading: boolean;
	detail = { };

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private commonService: CommonService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.requestTestPlan(params[ 'id' ]);
		});
	}

	async requestTestPlan(uuid) {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.getOneTestPlan(uuid);

		this.loading = false;
		if (response) {
			this.detail = response;

			const testd = await this.verificationAndValidationPlatformService.getOneTest(response[ 'testUUID' ]);
			this.detail[ 'testdName' ] = Object.keys(testd).length ? testd.name : 'Unknown';

			const ns = await this.commonService.getOneNetworkService('vnv', response[ 'serviceUUID' ]);
			this.detail[ 'serviceName' ] = Object.keys(ns).length ? ns.name : 'Unknown';
		} else {
			this.utilsService.openSnackBar('Unable to fetch the test plan', '');
			this.close();
		}
	}

	async confirmExecution() {
		this.loading = true;
		const uuid = this.detail[ 'uuid' ];
		const status = this.detail[ 'status' ] === 'WAITING_FOR_CONFIRMATION' ? 'SCHEDULED' : 'RETRIED';

		const response = await this.verificationAndValidationPlatformService.putNewTestPlanStatus(uuid, status);

		this.loading = false;
		response ?
			this.utilsService.openSnackBar('The test plan was executed', '')
			: this.utilsService.openSnackBar('Unable to execute the test plan', '');
	}

	async cancelExecution() {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.deleteTestPlan(this.detail[ 'uuid' ]);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('The test plan was cancelled', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('Unable to cancel the test plan', '');
		}
	}

	canShowExecute() {
		return this.detail[ 'uuid' ] && this.detail[ 'required' ] &&
			(this.detail[ 'status' ] === 'CANCELLED' || this.detail[ 'status' ] === 'ERROR');
	}

	canShowCancelExecution() {
		return this.detail[ 'status' ] === 'PENDING' || this.detail[ 'status' ] === 'NOT_CONFIRMED'
			|| this.detail[ 'status' ] === 'STARTING' || this.detail[ 'status' ] === 'SCHEDULED';
	}

	canShowRequiredConfirmation() {
		return this.detail[ 'required' ] && this.detail[ 'status' ] === 'WAITING_FOR_CONFIRMATION';
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
