import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-sla-template-detail',
	templateUrl: './sla-template-detail.component.html',
	styleUrls: [ './sla-template-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SlaTemplateDetailComponent implements OnInit {
	loading: boolean;
	detail = { };
	closed = false;

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
			const flavor = await this.servicePlatformService.getOneFlavor(this.detail[ 'ns' ], this.detail[ 'uuid' ]);

			if (flavor) {
				this.detail[ 'flavor' ] = this.utilsService.capitalizeFirstLetter(flavor);
			}
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

	canShowGuarantees() {
		return !this.closed && this.detail[ 'storedGuarantees' ] && this.detail[ 'storedGuarantees' ].length;
	}

	canShowLicense() {
		return !this.closed && (this.detail[ 'license' ] || this.detail[ 'licenseExpirationDate' ] || this.detail[ 'licenseInstances' ]);
	}

	openService() {
		this.router.navigate([ `service-platform/network-services/${ this.detail[ 'ns' ] }` ]);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
