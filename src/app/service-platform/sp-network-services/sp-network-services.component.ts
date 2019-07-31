import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-sp-network-services',
	templateUrl: './sp-network-services.component.html',
	styleUrls: [ './sp-network-services.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SpNetworkServicesComponent implements OnInit {
	loading: boolean;
	networkServices: Array<Object>;
	displayedColumns = [ 'vendor', 'name', 'version', 'status' ];

	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService,
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
		const response = await this.commonService.getNetworkServices('SP', search);

		this.loading = false;
		if (response) {
			this.networkServices = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch network services', '');
		}
	}

	openNetworkService(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
