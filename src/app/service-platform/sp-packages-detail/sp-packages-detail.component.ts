import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-sp-packages-detail',
	templateUrl: './sp-packages-detail.component.html',
	styleUrls: [ './sp-packages-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SpPackagesDetailComponent implements OnInit {
	displayedColumns = [ 'name', 'vendor', 'version' ];
	loading: boolean;
	detail = { };

	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService,
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
			.getOnePackage('sp', uuid)
			.then(response => {
				this.loading = false;
				this.detail = response;

				if (this.detail[ 'ns' ].lenght < 1) {
					this.detail[ 'ns' ] = [];
				}
				if (this.detail[ 'vnf' ].lenght < 1) {
					this.detail[ 'vnf' ] = [];
				}
			})
			.catch(err => {
				this.loading = false;
				this.utilsService.openSnackBar(err, '');
				this.close();
			});
	}

	close() {
		this.router.navigate([ 'service-platform/packages' ]);
	}
}
