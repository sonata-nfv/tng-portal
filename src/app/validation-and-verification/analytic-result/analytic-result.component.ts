import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-analytic-result',
	templateUrl: './analytic-result.component.html',
	styleUrls: [ './analytic-result.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticResultComponent implements OnInit {
	loading = false;
	detail = { };

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.requestAnalyticResult(params[ 'id' ]);
		});
	}

	async requestAnalyticResult(id) {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.getAnalyticResult(id);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the analytic result', '');
			this.close();
		}
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
