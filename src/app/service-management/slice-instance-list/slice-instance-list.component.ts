import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { ServiceManagementService } from '../service-management.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-slice-instance-list',
	templateUrl: './slice-instance-list.component.html',
	styleUrls: [ './slice-instance-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SliceInstanceListComponent implements OnInit, OnDestroy {
	loading: boolean;
	instances: Array<Object>;
	displayedColumns = [ 'vendor', 'name', 'template', 'status', 'stop' ];
	subscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private serviceManagementService: ServiceManagementService,
		private utilsService: UtilsService,
		private dialogData: DialogDataService
	) { }

	ngOnInit() {
		this.requestInstances();

		// Reloads the template list every when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/service-platform/slices/slice-instances' &&
				this.route.url[ 'value' ].length === 3 &&
				this.route.url[ 'value' ][ 2 ].path === 'slice-instances'
			) {
				this.requestInstances();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	searchFieldData(search) {
		this.requestInstances(search);
	}

	/**
     * Generates the HTTP request to get the list of Slice instances.
     *
     * @param search [Optional] Slice instances attributes that
     *                          must be matched by the returned
     *                          list of instances.
     */
	async requestInstances(search?) {
		this.loading = true;
		const response = await this.serviceManagementService.getSlicesInstances(search);

		this.loading = false;
		if (response) {
			this.instances = response;
		} else {
			this.utilsService.openSnackBar('There was an error fetching the instances', '');
		}
	}

	stopInstance(instance) {
		if (instance.state.toUpperCase() !== 'TERMINATED') {
			const title = 'Are you sure...?';
			const content = 'Are you sure you want to terminate this instance?';
			const action = 'Terminate';

			this.dialogData.openDialog(title, content, action, async () => {
				this.loading = true;
				const response = await this.serviceManagementService.postOneSliceInstanceTermination(instance.uuid);

				this.loading = false;
				if (response) {
					this.utilsService.openSnackBar('Terminating ' + response[ 'name' ] + ' instance...', '');
					this.requestInstances();
				} else {
					this.utilsService.openSnackBar('There was an error terminating the instance', '');
				}
			});
		} else {
			this.openInstance(instance);
		}
	}

	openInstance(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
