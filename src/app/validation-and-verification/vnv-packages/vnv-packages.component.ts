import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-vnv-packages',
	templateUrl: './vnv-packages.component.html',
	styleUrls: [ './vnv-packages.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VnvPackagesComponent implements OnInit {
	loading: boolean;
	packages = new Array();
	displayedColumns = [ 'vendor', 'name', 'version', 'status' ];

	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService,
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
