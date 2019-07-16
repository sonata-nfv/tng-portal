import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-test-results',
	templateUrl: './test-results.component.html',
	styleUrls: [ './test-results.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class TestResultsComponent implements OnInit {
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
			this.requestResults(params[ 'results_uuid' ]);
		});
	}

	async requestResults(uuid) {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.getTestResults(uuid);

		this.loading = false;
		if (response) {
			this.detail = response;

			const testd = await this.verificationAndValidationPlatformService.getOneTest(response[ 'testUUID' ]);
			this.detail[ 'testdName' ] = Object.keys(testd).length ? testd.name : 'Unknown';

			const ns = await this.commonService.getOneNetworkService('vnv', response[ 'serviceUUID' ]);
			this.detail[ 'serviceName' ] = Object.keys(ns).length ? ns.name : 'Unknown';
		} else {
			this.utilsService.openSnackBar('Unable to fetch the test result data', '');
			this.close();
		}
	}

	copyJSONToClipboard(json) {
		this.utilsService.copyToClipboard(this.stringifyJSON(json));
	}

	stringifyJSON(json) {
		return JSON.stringify(json);
	}

	close() {
		this.router.navigate([ '../../' ], { relativeTo: this.route });
	}
}
