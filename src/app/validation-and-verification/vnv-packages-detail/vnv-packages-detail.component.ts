import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-vnv-packages-detail',
	templateUrl: './vnv-packages-detail.component.html',
	styleUrls: [ './vnv-packages-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VnvPackagesDetailComponent implements OnInit {
	displayedColumns = [ 'name', 'vendor', 'version' ];
	loading: boolean;
	detail = { };

	constructor(
		private commonService: CommonService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.requestPackage(uuid);
		});
	}

	/**
     * Generates the HTTP request of a package by UUID.
     *
     * @param uuid ID of the selected package to be displayed.
     *             Comming from the route.
     */
	async requestPackage(uuid) {
		this.loading = true;
		const response = await this.commonService.getOnePackage('vnv', uuid);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the package details', '');
			this.close();
		}
	}

	canShowNS() {
		return this.detail[ 'ns' ] && this.detail[ 'ns' ].length;
	}

	canShowVNF() {
		return this.detail[ 'vnf' ] && this.detail[ 'vnf' ].length;
	}

	canShowTests() {
		return this.detail[ 'tests' ] && this.detail[ 'tests' ].length;
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
