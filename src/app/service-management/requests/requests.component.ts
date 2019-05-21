import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServiceManagementService } from '../service-management.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-requests',
	templateUrl: './requests.component.html',
	styleUrls: [ './requests.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class RequestsComponent implements OnInit {
	loading: boolean;
	requests: Array<object>;
	displayedColumns = [ 'name', 'serviceName', 'createdAt', 'type', 'status' ];
	searchText: string;

	constructor(
		private router: Router,
		private serviceManagementService: ServiceManagementService,
		private utilsService: UtilsService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.requestRequests();
	}

	searchFieldData(search) {
		this.requestRequests(search);
	}

	/**
     * Generates the HTTP request to get the list of NS requests.
     *
     * @param search [Optional] NS requests attributes that must
     *                          be matched by the returned list
     *                          of NS requests.
     */
	async requestRequests(search?) {
		this.loading = true;
		const response = await this.serviceManagementService.getRequests(search);

		this.loading = false;
		if (response) {
			this.requests = response;
		} else {
			this.utilsService.openSnackBar('There was an error while fetching the requests', '');
		}
	}

	openRequest(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
