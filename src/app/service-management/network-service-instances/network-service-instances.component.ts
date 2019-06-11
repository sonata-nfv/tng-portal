import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { ServiceManagementService } from '../service-management.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-network-service-instances',
	templateUrl: './network-service-instances.component.html',
	styleUrls: [ './network-service-instances.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class NetworkServiceInstancesComponent implements OnInit, OnDestroy {
	loading: boolean;
	instances: Array<Object>;
	subscription: Subscription;
	displayedColumns = [
		'name',
		'status',
		'version',
		'createdAt',
		'stop'
	];

	constructor(
		private serviceManagementService: ServiceManagementService,
		private router: Router,
		private utilsService: UtilsService,
		private route: ActivatedRoute,
		private dialogData: DialogDataService
	) { }

	ngOnInit() {
		this.requestNSInstances();

		// Reloads the template list every when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/service-management/network-service-instances' &&
				this.route.url[ 'value' ].length === 2 &&
				this.route.url[ 'value' ][ 1 ].path === 'network-service-instances'
			) {
				this.requestNSInstances();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	searchFieldData(search) {
		this.requestNSInstances(search);
	}

	/**
     * Generates the HTTP request to get the list of NS instances.
     *
     * @param search [Optional] NS instances attributes that must
     *                          be matched by the returned list
     *                          of NS instances.
     */
	async requestNSInstances(search?) {
		this.loading = true;
		const response = await this.serviceManagementService.getNSInstances(search);

		this.loading = false;
		if (response) {
			this.instances = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch any network service instance', '');
		}
	}

	terminate(row) {
		if (row.status.toUpperCase() !== 'TERMINATED') {
			const title = 'Are you sure...?';
			const content = 'Are you sure you want to terminate this instance?';
			const action = 'Terminate';

			this.dialogData.openDialog(title, content, action, async () => {
				this.loading = true;
				const response = await this.serviceManagementService.postOneNSInstanceTermination(row.uuid);

				this.loading = false;
				if (response) {
					const name = response[ 'name' ] ? response[ 'name' ] : '';
					this.utilsService.openSnackBar('Terminating ' + name + ' instance...', '');
					this.requestNSInstances();
				} else {
					this.utilsService.openSnackBar('There was an error terminating the instance', '');
				}
			});
		} else {
			this.openInstance(row.uuid);
		}
	}

	openInstance(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
