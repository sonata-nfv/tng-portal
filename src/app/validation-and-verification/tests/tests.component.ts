import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-tests',
	templateUrl: './tests.component.html',
	styleUrls: [ './tests.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class TestsComponent implements OnInit {
	loading: boolean;
	tests = new Array();
	displayedColumns = [ 'vendor', 'name', 'version', 'status' ]; // 'launch'
	subscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.requestTests();
	}

	searchFieldData(search) {
		this.requestTests(search);
	}

	/**
     * Generates the HTTP request to get the list of tests.
     *
     * @param search [Optional] Test attributes that
     *                          must be matched by the returned
     *                          list of tests.
     */
	async requestTests(search?) {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.getTests(search);

		this.loading = false;
		if (response) {
			this.tests = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch any test', '');
		}
	}

	openTest(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
