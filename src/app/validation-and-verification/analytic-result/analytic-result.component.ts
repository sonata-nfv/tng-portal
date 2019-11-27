import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { ConfigService } from '../../shared/services/config/config.service';

@Component({
	selector: 'app-analytic-result',
	templateUrl: './analytic-result.component.html',
	styleUrls: [ './analytic-result.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticResultComponent implements OnInit {
	loading = false;
	detail = { };
	@ViewChild('htmlResult') htmlResult: ElementRef;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private config: ConfigService,
		private utilsService: UtilsService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.requestAnalyticResult(params[ 'id' ]);
		});

		// Hide HTML embed while the URL of the resource is obtained
		this.htmlResult.nativeElement.style.display = 'none';
	}

	async requestAnalyticResult(id) {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.getAnalyticResult(id);

		this.loading = false;
		if (response) {
			this.detail = response;
			this.setURL(this.detail[ 'htmlResult' ]);
		} else {
			this.utilsService.openSnackBar('Unable to fetch the analytic result', '');
			this.close();
		}
	}

	async deleteAnalyticResult() {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.deleteAnalyticResult(this.detail[ 'id' ]);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Analytic result successfully removed', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('Unable to remove the analytic result', '');
		}
	}

	setURL(url) {
		try {
			if (!url) {
				return;
			}

			const finalUrl = `${ this.config.baseVNV }${ this.config.analyticResult }${ url }`;
			this.htmlResult.nativeElement.src = finalUrl;
			this.htmlResult.nativeElement.style.display = '';
		} catch (error) {
			console.error(error);
		}
	}

	canShowOtherResults() {
		return this.detail[ 'otherResults' ] && this.detail[ 'otherResults' ].length;
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
