import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-test-plan-list',
	templateUrl: './test-plan-list.component.html',
	styleUrls: [ './test-plan-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class TestPlanListComponent implements OnInit {
	loading: boolean;
	testPlans = new Array();
	displayedColumns = [ 'testName', 'serviceName', 'status', 'execute', 'stop' ];
	subscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private commonService: CommonService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.requestTestPlans();

		// Reloads the list when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/validation-and-verification/test-plans' &&
				this.route.url[ 'value' ].length === 2 &&
				this.route.url[ 'value' ][ 1 ].path === 'test-plans'
			) {
				this.requestTestPlans();
			}
		});
	}

	searchFieldData(search) {
		this.requestTestPlans(search);
	}

	/**
     * Generates the HTTP request to get the list of test plans.
     *
     * @param search [Optional] Test plan attributes that
     *                          must be matched by the returned
     *                          list of tests.
     */
	async requestTestPlans(search?) {
		this.loading = true;
		const testPlans = await this.verificationAndValidationPlatformService.getTestPlans(search);
		const testDescriptors = await this.verificationAndValidationPlatformService.getTests();
		const nsList = await this.commonService.getNetworkServices('V&V');

		this.loading = false;
		if (testPlans) {
			// Additional information to test plans: test descriptor name and network service name
			testPlans.forEach(plan => {
				const descriptor = testDescriptors.find(item => plan.testUUID === item.uuid);
				const testName = descriptor ? descriptor.name : 'Unknown';
				const ns = nsList.find(item => plan.serviceUUID === item.uuid);
				const serviceName = ns ? ns.name : 'Unknown';

				return (plan[ 'testdName' ] = testName, plan[ 'serviceName' ] = serviceName);
			});

			this.testPlans = this.sortTestPlans(testPlans);
		} else {
			this.utilsService.openSnackBar('Unable to fetch any test plan', '');
		}
	}

	private sortTestPlans(testPlans) {
		return testPlans.sort((a) => {
			const status = a.status.toUpperCase();

			if (status !== 'COMPLETED') {
				return -1;
			} else {
				return 1;
			}
		});
	}

	async confirmExecution(plan) {
		this.loading = true;
		const uuid = plan.uuid;
		const status = plan.status === 'WAITING_FOR_CONFIRMATION' ? 'SCHEDULED' : 'RETRIED';

		const response = await this.verificationAndValidationPlatformService.putNewTestPlanStatus(uuid, status);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('The test plan was executed', '');
			this.requestTestPlans();
		} else {
			this.utilsService.openSnackBar('Unable to execute the test plan', '');
		}
	}

	async cancelExecution(plan) {
		console.log('cancelling');
	}

	isActiveRow(row) {
		const status = row.status.toUpperCase();
		return status !== 'COMPLETED';
	}

	canShowMessage() {
		return (!this.testPlans || !this.testPlans.length) && !this.loading;
	}

	canShowCancelExecution(testPlan) {
		return testPlan.status === 'PENDING' || testPlan.status === 'NOT_CONFIRMED'
			|| testPlan.status === 'STARTING' || testPlan.status === 'SCHEDULED';
	}

	canShowExecute(testPlan) {
		return testPlan.required &&
			(testPlan.status === 'CANCELLED' || testPlan.status === 'ERROR');
	}

	canShowRequiredConfirmation(testPlan) {
		return testPlan.required && testPlan.status === 'WAITING_FOR_CONFIRMATION';
	}

	openTest(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
