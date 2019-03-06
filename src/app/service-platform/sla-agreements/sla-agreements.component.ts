import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-sla-agreements',
	templateUrl: './sla-agreements.component.html',
	styleUrls: [ './sla-agreements.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SlaAgreementsComponent implements OnInit {
	loading: boolean;
	agreements = new Array();
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
	requestAgreements(search?) {
		this.loading = true;
		this.servicePlatformService
			.getSLAAgreements(search)
			.then(response => {
				this.loading = false;
				this.agreements = response;
			})
			.catch(err => {
				this.loading = false;
				this.utilsService.openSnackBar(err, '');
			});
	}

	openAgreement(row) {
		const sla_uuid = row.uuid;
		const ns_uuid = row.ns_uuid;
		this.router.navigate([ sla_uuid, ns_uuid ], {
			relativeTo: this.route
		});
	}
}
