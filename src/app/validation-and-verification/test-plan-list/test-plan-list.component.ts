import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';
import { ServiceManagementModule } from '../../service-management/service-management.module';

@Component({
	selector: 'app-test-plan-list',
	templateUrl: './test-plan-list.component.html',
	styleUrls: [ './test-plan-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class TestPlanListComponent implements OnInit {
	loading: boolean;
	testPlans = new Array();
	displayedColumns = [ 'testName', 'serviceName', 'status', 'required' ];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private commonService: CommonService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.requestTestPlans();
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

	async setRequired(uuid) {
		// TODO request to set/unset required
	}

	isActiveRow(row) {
		const status = row.status.toUpperCase();
		return status !== 'COMPLETED';
	}

	canShowMessage() {
		return (!this.testPlans || !this.testPlans.length) && !this.loading;
	}

	openTest(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}