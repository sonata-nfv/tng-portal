import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UtilsService } from '../../services/common/utils.service';
import { CommonService } from '../../services/common/common.service';

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
		private commonService: CommonService,
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
		const response = await this.commonService.getOneRequest(uuid);

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

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
