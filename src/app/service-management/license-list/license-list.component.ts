import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServiceManagementService } from '../service-management.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-license-list',
	templateUrl: './license-list.component.html',
	styleUrls: [ './license-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class LicenceListComponent implements OnInit {
	loading: boolean;
	licenses: Array<object>;
	displayedColumns = [ 'status', 'type', 'current', 'allowed', 'expiration', 'buy' ];

	constructor(
		private serviceManagementService: ServiceManagementService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.requestLicenses();
	}

	searchFieldData(search) {
		this.requestLicenses(search);
	}

	async requestLicenses(search?) {
		this.loading = true;
		const response = await this.serviceManagementService.getLicences(search);

		this.loading = false;
		if (response) {
			this.licenses = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch any license', '');
		}
	}

	openLicences(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}

	async buy(row) {
		this.loading = true;
		const license = {
			ns_uuid: row[ 'nsUUID' ],
			sla_uuid: row[ 'slaUUID' ],
		};
		const response = await this.serviceManagementService.postOneLicense(license);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar(response[ 'Succes' ], '');
		} else {
			this.utilsService.openSnackBar('Unable to buy the license', '');
		}
	}
}
