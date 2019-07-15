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
			this.detail[ 'testdName' ] = testd ? testd.name : 'Unknown';

			const ns = await this.commonService.getOneNetworkService('vnv', response[ 'serviceUUID' ]);
			this.detail[ 'serviceName' ] = ns ? ns.name : 'Unknown';
		} else {
			this.utilsService.openSnackBar('Unable to fetch the test plan', '');
			this.close();
		}
	}

	async setRequired(value) {
		// TODO request to set/unset required
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
