import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UtilsService } from '../../shared/services/common/utils.service';
import { ServiceManagementService } from '../service-management.service';

@Component({
	selector: 'app-request-detail',
	templateUrl: './request-detail.component.html',
	styleUrls: [ './request-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class RequestDetailComponent implements OnInit {
	loading: boolean;
	detail = { };

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private serviceManagementService: ServiceManagementService,
		private utilsService: UtilsService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.requestRequest(uuid);
		});
	}

	/**
     * Generates the HTTP request of a defined NS request by UUID.
     *
     * @param uuid ID of the selected NS request to be displayed.
     *             Comming from the route.
     */
	async requestRequest(uuid) {
		this.loading = true;
		const response = await this.serviceManagementService.getOneRequest(uuid);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the request record', '');
			this.close();
		}
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	openService() {
		this.router.navigate([ `service-management/network-services/services/${ this.detail[ 'serviceUUID' ] }` ]);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
