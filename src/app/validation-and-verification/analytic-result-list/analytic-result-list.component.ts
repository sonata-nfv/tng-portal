import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-analytic-result-list',
	templateUrl: './analytic-result-list.component.html',
	styleUrls: [ './analytic-result-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticResultListComponent implements OnInit, OnDestroy {
	loading: boolean;
	results = new Array();
	displayedColumns = [ 'name', 'test', 'testResult', 'serviceName', 'status', 'executionDate', 'delete' ];
	subscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.requestAnalyticResults();

		// Reloads the list when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/validation-and-verification/analytic-results' &&
				this.route.url[ 'value' ].length === 2 &&
				this.route.url[ 'value' ][ 1 ].path === 'analytic-results'
			) {
				this.requestAnalyticResults();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	searchFieldData(search) {
		this.requestAnalyticResults(search);
	}

	async requestAnalyticResults(search?) {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.getAnalyticResults(search);

		this.loading = false;
		if (response) {
			this.results = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch any analytic result', '');
		}
	}

	async deleteAnalyticResult(uuid) {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.deleteAnalyticResult(uuid);

		this.loading = false;
		response ?
			this.utilsService.openSnackBar('Analytic result successfully removed', '')
			: this.utilsService.openSnackBar('Unable to remove the analytic result', '');
	}

	createNew() {
		this.router.navigate([ 'new' ], { relativeTo: this.route });
	}

	openTest(testUUID) {
		this.router.navigate([ testUUID ], { relativeTo: this.route });
	}
}
