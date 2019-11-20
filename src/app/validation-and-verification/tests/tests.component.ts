import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';

import { ExecuteTestDialogComponent } from '../execute-test-dialog/execute-test-dialog.component';

@Component({
	selector: 'app-tests',
	templateUrl: './tests.component.html',
	styleUrls: [ './tests.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class TestsComponent implements OnInit, OnDestroy {
	loading: boolean;
	tests = new Array();
	displayedColumns = [ 'vendor', 'name', 'version', 'status', 'execute' ];
	subscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService,
		private executeTestDialog: MatDialog
	) { }

	ngOnInit() {
		this.requestTests();

		// Reloads the list when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/validation-and-verification/tests' &&
				this.route.url[ 'value' ].length === 2 &&
				this.route.url[ 'value' ][ 1 ].path === 'tests'
			) {
				this.requestTests();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
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

	execute(test) {
		this.executeTestDialog.open(ExecuteTestDialogComponent, {
			data: { section: 'tests', uuid: test.uuid, name: test.name }
		});
	}

	openTest(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
