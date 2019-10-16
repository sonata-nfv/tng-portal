import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { PlatformsService } from '../platforms.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-platform-list',
	templateUrl: './platform-list.component.html',
	styleUrls: [ './platform-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class PlatformListComponent implements OnInit, OnDestroy {
	loading: boolean;
	subscription: Subscription;
	platforms: Array<Object>;
	displayedColumns = [
		'name',
		'type',
		'host',
		'delete'
	];
	constructor(
		private platformsService: PlatformsService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.requestPlatforms();

		// Reloads the template list every when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/platforms' &&
				this.route.url[ 'value' ].length === 1 &&
				this.route.url[ 'value' ][ 0 ].path === 'platforms'
			) {
				this.requestPlatforms();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	searchFieldData(search) {
		this.requestPlatforms(search);
	}

	/**
	 * Generates the HTTP request to get the list of Platforms.
	 *
	 * @param search [Optional] Platforms' attributes that
	 *                          must be matched by the returned
	 *                          list.
	 */
	async requestPlatforms(search?) {
		this.loading = true;
		const response = await this.platformsService.getPlatforms(search);

		this.loading = false;
		if (response) {
			this.platforms = response;
		} else {
			this.utilsService.openSnackBar('There was an error fetching the platforms', '');
		}
	}

	createNew() {
		this.router.navigate([ 'new' ], { relativeTo: this.route });
	}

	openPlatform(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}

	async deletePlatform(name) {
		this.loading = true;
		const response = await this.platformsService.deletePlatform(name);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Platform deleted', '');
			this.requestPlatforms();
		} else {
			this.utilsService.openSnackBar('There was an error deleting the platform', '');
		}
	}

}
