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
	requestTest(uuid) {
		this.loading = true;

		this.verificationAndValidationPlatformService
			.getOneTest(uuid)
			.then(response => {
				this.detail = response;
			})
			.then(() => {
				this.verificationAndValidationPlatformService
					.getTestExecutions(this.detail[ 'uuid' ])
					.then(response => {
						this.loading = false;

						if (response.length < 1) {
							this.utilsService.openSnackBar(
								'There are no test executions available',
								''
							);
						} else {
							this.executions = response;
						}
					});
			})
			.catch(err => {
				this.loading = false;
				this.utilsService.openSnackBar(err, '');
				this.close();
			});
	}

	launch() {
		this.verificationAndValidationPlatformService
			.postOneTest('test', this.detail[ 'uuid' ])
			.then(response => {
				this.utilsService.openSnackBar('Success!', '');
			})
			.catch(err => {
				this.utilsService.openSnackBar(err, '');
			});
	}

	openTestResults(row) {
		this.router.navigate([ 'results', row[ 'uuid' ] ], {
			relativeTo: this.route
		});
	}

	close() {
		this.router.navigate([ 'validation-and-verification/tests' ]);
	}
}
