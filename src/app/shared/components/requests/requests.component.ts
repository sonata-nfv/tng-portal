import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../services/common/common.service';
import { UtilsService } from '../../services/common/utils.service';

@Component({
	selector: 'app-requests',
	templateUrl: './requests.component.html',
	styleUrls: [ './requests.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class RequestsComponent implements OnInit {
	loading: boolean;
	requests: Array<object>;
	section: string;
	displayedColumns = [ 'name', 'serviceName', 'createdAt', 'type', 'status' ];
	searchText: string;

	constructor(
		private router: Router,
		private commonService: CommonService,
		private utilsService: UtilsService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.section = this.route.url[ 'value' ][ 0 ].path
			.replace(/-/g, ' ')
			.toUpperCase();

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
		const response = await this.commonService.getRequests(search);

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
