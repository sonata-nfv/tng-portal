import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';

import { ExecuteTestDialogComponent } from '../execute-test-dialog/execute-test-dialog.component';

@Component({
	selector: 'app-vnv-network-services',
	templateUrl: './vnv-network-services.component.html',
	styleUrls: [ './vnv-network-services.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VnvNetworkServicesComponent implements OnInit, OnDestroy {
	loading: boolean;
	networkServices: Array<Object>;
	displayedColumns = [ 'vendor', 'name', 'version', 'status', 'execute' ];
	subscription: Subscription;

	constructor(
		private commonService: CommonService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute,
		private executeTestDialog: MatDialog,
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

	ngOnDestroy() {
		this.subscription.unsubscribe();
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
		this.executeTestDialog.open(ExecuteTestDialogComponent, {
			data: { section: 'ns', uuid: ns.uuid, name: ns.name, policiesEnabled: true }
		});
	}

	openNetworkService(row) {
		this.router.navigate([ row.uuid ], { relativeTo: this.route });
	}
}
