import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-sp-functions-detail',
	templateUrl: './sp-functions-detail.component.html',
	styleUrls: [ './sp-functions-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SpFunctionsDetailComponent implements OnInit {
	loading: boolean;
	detail = { };

	constructor(
		private servicePlatformService: ServicePlatformService,
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.requestFunction(uuid);
		});
	}

	/**
     * Generates the HTTP request of a function by UUID.
     *
     * @param uuid ID of the selected function to be displayed.
     *             Comming from the route.
     */
	async requestFunction(uuid) {
		this.loading = true;
		const response = await this.servicePlatformService.getOneFunction(uuid);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the function data', '');
			this.close();
		}
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
