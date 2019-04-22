import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-sla-templates-detail',
	templateUrl: './sla-templates-detail.component.html',
	styleUrls: [ './sla-templates-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SlaTemplatesDetailComponent implements OnInit {
	loading: boolean;
	detail = { };
	templateForm: FormGroup;
	closed = true;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private servicePlatformService: ServicePlatformService,
		private utilsService: UtilsService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.requestSLATemplate(uuid);
		});
	}

	/**
     * Generates the HTTP request of a SLA Template by UUID.
     *
     * @param uuid ID of the selected template to be displayed.
     *             Comming from the route.
     */
	async requestSLATemplate(uuid) {
		this.loading = true;
		const response = await this.servicePlatformService.getOneSLATemplate(uuid);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch SLA template', '');
			this.close();
		}
	}

	async deleteTemplate() {
		this.loading = true;
		const response = await this.servicePlatformService.deleteOneSLATemplate(this.detail[ 'uuid' ]);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Template deleted', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('Unable to delete the SLA template', '');
		}
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
