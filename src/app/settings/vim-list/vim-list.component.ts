import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { SettingsService } from '../settings.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-vim-list',
	templateUrl: './vim-list.component.html',
	styleUrls: [ './vim-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VimListComponent implements OnInit, OnDestroy {
	loading: boolean;
	subscription: Subscription;
	vims: Array<Object>;
	displayedColumns = [
		'name',
		'type',
		'city',
		'country',
		'endpoint',
		'delete'
	];

	constructor(
		private settingsService: SettingsService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.requestVims();

		// Reloads the template list every when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/settings/vim' &&
				this.route.url[ 'value' ].length === 2 &&
				this.route.url[ 'value' ][ 1 ].path === 'vim'
			) {
				this.requestVims();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	searchFieldData(search) {
		this.requestVims(search);
	}

	/**
     * Generates the HTTP request to get the list of VIMs.
     *
     * @param search [Optional] VIMs attributes that
     *                          must be matched by the returned
     *                          list of VIMs.
     */
	async requestVims(search?) {
		this.loading = true;
		const response = await this.settingsService.getVims();

		this.loading = false;
		if (response) {
			this.vims = response;
		} else {
			this.utilsService.openSnackBar('There was an error fetching the VIMs', '');
		}
	}

	createNew() {
		this.router.navigate([ 'new' ], { relativeTo: this.route });
	}

	async deleteVim(uuid) {
		this.loading = true;
		const response = await this.settingsService.deleteVim(uuid);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('VIM deleted', '');
			this.requestVims();
		} else {
			this.utilsService.openSnackBar('There was an error deleting the VIM', '');
		}

	}

	openVim(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
