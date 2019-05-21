import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-sp-slice-template-detail',
	templateUrl: './sp-slice-template-detail.component.html',
	styleUrls: [ './sp-slice-template-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SpSliceTemplateDetailComponent implements OnInit {
	loading: boolean;
	detail = { };
	displayedColumns = [ 'uuid', 'serviceName', 'isShared', 'slaName' ];
	displayedColumnsLinks = [ 'networkName', 'mngmtNetwork', 'type' ];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private servicePlatformService: ServicePlatformService,
		private utilsService: UtilsService,
		private commonService: CommonService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.requestSliceTemplate(params[ 'id' ]);
		});
	}

	/**
     * Generates the HTTP request of a Slices Template by UUID.
     *
     * @param uuid ID of the selected template to be displayed.
     *             Comming from the route.
     */
	async requestSliceTemplate(uuid) {
		this.loading = true;
		const response = await this.commonService.getOneSliceTemplate(uuid);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the template.', '');
			this.close();
		}
	}

	isInUse() {
		return this.utilsService.capitalizeFirstLetter(this.detail[ 'usageState' ]) === 'In use';
	}

	async deleteTemplate() {
		this.loading = true;
		const response = await this.servicePlatformService.deleteOneSlicesTemplate(this.detail[ 'uuid' ]);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Template deleted', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('There was an error deleting the template.', '');

		}
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
