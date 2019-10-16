import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { SettingsService } from '../settings.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-wim-list',
	templateUrl: './wim-list.component.html',
	styleUrls: [ './wim-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class WimListComponent implements OnInit, OnDestroy {
	loading: boolean;
	subscription: Subscription;
	wims: Array<Object>;
	displayedColumns = [
		'name',
		'type',
		'endpoint',
		'delete'
	];

	constructor(
		private settingsService: SettingsService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.requestWims();

		// Reloads the template list every when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/settings/wim' &&
				this.route.url[ 'value' ].length === 2 &&
				this.route.url[ 'value' ][ 1 ].path === 'wim'
			) {
				this.requestWims();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	searchFieldData(search) {
		this.requestWims(search);
	}

	/**
         * Generates the HTTP request to get the list of WIMs.
         *
         * @param search [Optional] WIMs attributes that
         *                          must be matched by the returned
         *                          list.
         */
	async requestWims(search?) {
		this.loading = true;
		const response = await this.settingsService.getWims(search);

		this.loading = false;
		if (response) {
			this.wims = response;
		} else {
			this.utilsService.openSnackBar('There was an error fetching the WIMs', '');
		}
	}

	createNew() {
		this.router.navigate([ 'new' ], { relativeTo: this.route });
	}

	async deleteWim(uuid) {
		this.loading = true;
		const response = await this.settingsService.deleteVim(uuid);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('WIM deleted', '');
			this.requestWims();
		} else {
			this.utilsService.openSnackBar('There was an error deleting the WIM', '');
		}
	}

	openWim(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
