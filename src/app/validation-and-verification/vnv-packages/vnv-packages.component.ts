import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-vnv-packages',
	templateUrl: './vnv-packages.component.html',
	styleUrls: [ './vnv-packages.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VnvPackagesComponent implements OnInit, OnDestroy {
	loading: boolean;
	packages = new Array();
	displayedColumns = [ 'vendor', 'name', 'version', 'status' ];
	subscription: Subscription;

	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.requestPackages();

		// Reloads the list when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/validation-and-verification/packages' &&
				this.route.url[ 'value' ].length === 2 &&
				this.route.url[ 'value' ][ 1 ].path === 'packages'
			) {
				this.requestPackages();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	searchFieldData(search) {
		this.requestPackages(search);
	}

	/**
     * Generates the HTTP request to get the list of packages.
     *
     * @param search [Optional] Package attributes that must be
     *                          matched by the returned list of
     *                          packages.
     */
	async requestPackages(search?) {
		this.loading = true;
		const response = await this.commonService.getPackages('V&V', search);

		this.loading = false;
		if (response) {
			this.packages = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch any package', '');
		}
	}

	openPackage(row) {
		this.router.navigate([ row.uuid ], { relativeTo: this.route });
	}
}
