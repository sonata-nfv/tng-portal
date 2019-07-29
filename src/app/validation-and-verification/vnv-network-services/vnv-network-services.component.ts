import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';
import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';

@Component({
	selector: 'app-vnv-network-services',
	templateUrl: './vnv-network-services.component.html',
	styleUrls: [ './vnv-network-services.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VnvNetworkServicesComponent implements OnInit {
	loading: boolean;
	networkServices: Array<Object>;
	displayedColumns = [ 'vendor', 'name', 'version', 'status', 'execute' ];
	subscription: Subscription;

	constructor(
		private commonService: CommonService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute,
		private dialogData: DialogDataService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.requestServices();

		// Reloads the list when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/validation-and-verification/network-services' &&
				this.route.url[ 'value' ].length === 2 &&
				this.route.url[ 'value' ][ 1 ].path === 'network-services'
			) {
				this.requestServices();
			}
		});
	}

	searchFieldData(search) {
		this.requestServices(search);
	}

	/**
     * Generates the HTTP request to get the list of NS.
     *
     * @param search [Optional] Network Service attributes that
     *                          must be matched by the returned
     *                          list of NS.
     */
	async requestServices(search?) {
		this.loading = true;
		const response = await this.commonService.getNetworkServices('V&V', search);

		this.loading = false;
		if (response) {
			this.networkServices = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch network services', '');
		}
	}

	execute(ns) {
		const title = ns.name;
		const content = 'Do you want to automatically execute the related tests? \
						Otherwise, the tests planned will require your manual \
						confirmation to be run. ';
		const action = 'Yes';
		const secondaryAction = 'No';

		this.dialogData.openDialog(title, content, action,
			() => this.createTestPlans(ns.uuid, false),
			() => this.createTestPlans(ns.uuid, true), secondaryAction);
	}

	async createTestPlans(uuid, confirmRequired) {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.postTestPlans('ns', uuid, confirmRequired);

		this.loading = false;
		response ?
			this.router.navigate([ 'validation-and-verification/test-plans' ])
			: this.utilsService.openSnackBar('Unable to execute this test', '');
	}

	openNetworkService(row) {
		this.router.navigate([ row.uuid ], { relativeTo: this.route });
	}
}
