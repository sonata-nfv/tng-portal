import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-vnv-network-services',
	templateUrl: './vnv-network-services.component.html',
	styleUrls: [ './vnv-network-services.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VnvNetworkServicesComponent implements OnInit {
	loading: boolean;
	networkServices: Array<Object>;
	displayedColumns = [ 'vendor', 'name', 'version', 'status' ];

	constructor(
		private commonService: CommonService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.requestServices();
	}

	searchFieldData(search) {
		this.requestServices(search);
	}

	/**
     * Generates the HTTP request to get the list of NS.
     *
     * @param search [Optional] Network Service attributes that
     *                          must be matched by the returned
     *                          list of NS.
     */
	async requestServices(search?) {
		this.loading = true;
		const response = await this.commonService.getNetworkServices('V&V', search);

		this.loading = false;
		if (response) {
			this.networkServices = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch network services', '');
		}
	}

	openNetworkService(row) {
		this.router.navigate([ row.uuid ], { relativeTo: this.route });
	}
}
