import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { SettingsService } from '../settings.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-endpoint-list',
	templateUrl: './endpoint-list.component.html',
	styleUrls: [ './endpoint-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class EndpointListComponent implements OnInit, OnDestroy {
	loading: boolean;
	subscription: Subscription;
	endpoints: Array<Object>;
	displayedColumns = [
		'name',
		'type',
		'city',
		'country'
	];

	constructor(
		private settingsService: SettingsService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.requestEndpoints();

		// Reloads the template list every when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/settings/endpoint' &&
				this.route.url[ 'value' ].length === 2 &&
				this.route.url[ 'value' ][ 1 ].path === 'endpoint'
			) {
				this.requestEndpoints();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	searchFieldData(search) {
		this.requestEndpoints(search);
	}

	/**
     * Generates the HTTP request to get the list of endpoints.
     *
     * @param search [Optional] Endpoint attributes that
     *                          must be matched by the returned
     *                          list of endpoints.
     */
	async requestEndpoints(search?) {
		this.loading = true;
		const response = await this.settingsService.getVims();

		this.loading = false;
		if (response) {
			this.endpoints = response.filter(item => item.type === 'endpoint');
		} else {
			this.utilsService.openSnackBar('There was an error fetching the endpoints', '');
		}
	}
}
