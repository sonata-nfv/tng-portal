import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-sp-packages',
	templateUrl: './sp-packages.component.html',
	styleUrls: [ './sp-packages.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SpPackagesComponent implements OnInit {
	loading: boolean;
	packages = new Array();
	displayedColumns = [ 'name', 'vendor', 'version', 'createdAt' ];

	constructor(
		private commonService: CommonService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.requestPackages();
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
		const response = await this.commonService.getPackages('SP', search);

		this.loading = false;
		if (response) {
			this.packages = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch any package', '');
		}

	}

	openPackage(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
