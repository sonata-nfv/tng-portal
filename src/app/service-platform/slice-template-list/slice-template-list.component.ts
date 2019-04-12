import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

import { SliceInstanceCreateComponent } from '../slice-instance-create/slice-instance-create.component';

@Component({
	selector: 'app-slice-template-list',
	templateUrl: './slice-template-list.component.html',
	styleUrls: [ './slice-template-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SliceTemplateListComponent implements OnInit, OnDestroy {
	loading: boolean;
	templates: Array<Object>;
	displayedColumns = [
		'vendor',
		'name',
		'version',
		'author',
		'usageState',
		'instantiate',
		'delete'
	];
	subscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private servicePlatformService: ServicePlatformService,
		private utilsService: UtilsService,
		private instantiateDialog: MatDialog
	) { }

	ngOnInit() {
		this.requestTemplates();

		// Reloads the template list every when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/service-platform/slices/slices-templates' &&
				this.route.url[ 'value' ].length === 3 &&
				this.route.url[ 'value' ][ 2 ].path === 'slices-templates'
			) {
				this.requestTemplates();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	searchFieldData(search) {
		this.requestTemplates(search);
	}

	/**
     * Generates the HTTP request to get the list of Slices templates.
     *
     * @param search [Optional] Slices template attributes that
     *                          must be matched by the returned
     *                          list of templates.
     */
	async requestTemplates(search?) {
		this.loading = true;
		const response = await this.servicePlatformService.getSlicesTemplates(search);

		this.loading = false;
		if (response) {
			this.templates = response;
		} else {
			this.utilsService.openSnackBar('There was an error fetching the templates', '');
		}
	}

	instantiate(nst) {
		this.instantiateDialog.open(SliceInstanceCreateComponent, {
			data: {
				nstId: nst.uuid,
				vendor: nst.vendor,
				name: nst.name,
				version: nst.version
			}
		});
	}

	async deleteTemplate(uuid) {
		this.loading = true;
		const response = await this.servicePlatformService.deleteOneSlicesTemplate(uuid);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Template deleted', '');
			this.requestTemplates();
		} else {
			this.utilsService.openSnackBar('There was an error deleting the template', '');
		}
	}

	createNew() {
		this.router.navigate([ 'new' ], { relativeTo: this.route });
	}

	openTemplate(uuid) {
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
