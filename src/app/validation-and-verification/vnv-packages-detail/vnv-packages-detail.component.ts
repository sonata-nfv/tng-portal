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
	detail = {};

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
	requestPackage(uuid) {
		this.loading = true;

		this.commonService
			.getOnePackage('vnv', uuid)
			.then(response => {
				this.loading = false;
				this.detail = response;

				if (this.detail[ 'ns' ].lenght < 1) {
					this.detail[ 'ns' ] = [];
				}
				if (this.detail[ 'vnf' ].lenght < 1) {
					this.detail[ 'vnf' ] = [];
				}
				if (this.detail[ 'tests' ].lenght < 1) {
					this.detail[ 'tests' ] = [];
				}
			})
			.catch(err => {
				this.loading = false;
				this.utilsService.openSnackBar(err, '');
				this.close();
			});
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
