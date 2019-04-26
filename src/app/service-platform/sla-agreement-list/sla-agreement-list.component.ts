import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-sla-agreement-list',
	templateUrl: './sla-agreement-list.component.html',
	styleUrls: [ './sla-agreement-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SlaAgreementListComponent implements OnInit {
	loading: boolean;
	agreements: Array<any>;
	displayedColumns = [ 'name', 'status', 'ns', 'customer', 'date' ];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private servicePlatformService: ServicePlatformService,
		private utilsService: UtilsService
	) { }

	ngOnInit() {
		this.requestAgreements();
	}

	searchFieldData(search) {
		this.requestAgreements(search);
	}

	/**
     * Generates the HTTP request to get the list of SLA agreements.
     *
     * @param search [Optional] SLA agreement attributes that
     *                          must be matched by the returned
     *                          list of agreements.
     */
	async requestAgreements(search?) {
		this.loading = true;
		const response = await this.servicePlatformService.getSLAAgreements(search);

		this.loading = false;
		if (response) {
			this.agreements = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch any SLA agreement', '');
		}
	}

	openAgreement(row) {
		const slaUUID = row.uuid;
		const nsiUUID = row.nsiUUID;
		this.router.navigate([ slaUUID, nsiUUID ], { relativeTo: this.route });
	}
}
