import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-tests-detail',
	templateUrl: './tests-detail.component.html',
	styleUrls: [ './tests-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class TestsDetailComponent implements OnInit {
	loading: boolean;
	detail = { };
	executions = new Array();
	displayedColumns = [ 'vendor', 'name', 'version' ];
	displayedColumnsExecutions = [ 'uuid', 'serviceUUID', 'date', 'status' ];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.requestTest(params[ 'id' ]);
		});
	}

	/**
     * Generates the HTTP request of a Slices instance by UUID.
     *
     * @param uuid ID of the selected instance to be displayed.
     *             Comming from the route.
     */
	async requestTest(uuid) {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.getOneTest(uuid);

		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the test', '');
			this.close();
		}

		const executions = await this.verificationAndValidationPlatformService.getTestExecutions(this.detail[ 'uuid' ]);

		this.loading = false;
		if (executions) {
			this.executions = executions;
		} else {
			this.utilsService.openSnackBar('There are no test executions available', '');
		}
	}

	openTestResults(row) {
		this.router.navigate([ 'results', row[ 'uuid' ] ], { relativeTo: this.route });
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
