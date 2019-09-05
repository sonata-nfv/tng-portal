import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-sp-network-services-detail',
	templateUrl: './sp-network-services-detail.component.html',
	styleUrls: [ './sp-network-services-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SpNetworkServicesDetailComponent implements OnInit {
	loading: boolean;
	detail = { };
	displayedColumns = [ 'id', 'name', 'vendor', 'version' ];

	constructor(
		private commonService: CommonService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.requestNetworkService(uuid);
		});
	}

	async requestNetworkService(uuid) {
		this.loading = true;
		const response = await this.commonService.getOneNetworkService('sp', uuid);

		this.loading = false;
		if (response) {
			this.detail = response;

			if (this.detail[ 'vnf' ].lenght < 1) {
				this.detail[ 'vnf' ] = [];
			}
		} else {
			this.utilsService.openSnackBar('Unable to fetch the network service', '');
			this.close();
		}
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	canShowVNFs() {
		return (!this.detail[ 'vnf' ] || !this.detail[ 'vnf' ].length) && !this.loading;
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
