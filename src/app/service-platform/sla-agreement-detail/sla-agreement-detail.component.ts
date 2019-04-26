import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-sla-agreement-detail',
	templateUrl: './sla-agreement-detail.component.html',
	styleUrls: [ './sla-agreement-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SlaAgreementDetailComponent implements OnInit {
	loading: boolean;
	closed = false;
	detail = { };

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private servicePlatformService: ServicePlatformService,
		private utilsService: UtilsService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const slaUUID = params[ 'id_sla' ];
			const nsiUUID = params[ 'id_nsi' ];
			this.requestSLAAgreement(slaUUID, nsiUUID);
		});
	}

	/**
     * Generates the HTTP request of a SLA Agreement by UUID.
     *
     * @param uuid ID of the selected agreement to be displayed.
     *             Comming from the route.
     */
	async requestSLAAgreement(slaUUID, nsiUUID) {
		this.loading = true;
		const response = await this.servicePlatformService.getOneSLAAgreement(slaUUID, nsiUUID);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the SLA agreement', '');
			this.close();
		}
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	canShowGuarantees() {
		return !this.closed && this.detail[ 'guarantees' ];
	}

	canShowLicense() {
		return !this.closed && (this.detail[ 'license' ] || this.detail[ 'licenseExpirationDate' ] || this.detail[ 'licenseInstances' ]);
	}

	close() {
		this.router.navigate([ 'service-platform/slas/sla-agreements' ]);
	}
}
