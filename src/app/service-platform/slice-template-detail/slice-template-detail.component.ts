import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

import { SlicesInstancesCreateComponent } from '../slices-instances-create/slices-instances-create.component';

@Component({
	selector: 'app-slice-template-detail',
	templateUrl: './slice-template-detail.component.html',
	styleUrls: [ './slice-template-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SliceTemplateDetailComponent implements OnInit {
	loading: boolean;
	detail = { };
	displayedColumns = [ 'serviceName', 'isShared', 'slaName' ];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private servicePlatformService: ServicePlatformService,
		private utilsService: UtilsService,
		private instantiateDialog: MatDialog
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
		const response = await this.servicePlatformService.getOneSliceTemplate(uuid);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the template.', '');
			this.close();
		}
	}

	isInUse() {
		return this.utilsService.capitalizeFirstLetter(this.detail['usageState']) === 'In use';
	}

	instantiate() {
		this.instantiateDialog.open(SlicesInstancesCreateComponent, {
			data: {
				nstId: this.detail[ 'uuid' ],
				vendor: this.detail[ 'vendor' ],
				name: this.detail[ 'name' ],
				version: this.detail[ 'version' ]
			}
		});
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

	close() {
		this.router.navigate([ 'service-platform/slices/slices-templates' ]);
	}
}
