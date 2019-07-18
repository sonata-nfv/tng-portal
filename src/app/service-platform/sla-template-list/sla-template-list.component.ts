import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-sla-template-list',
	templateUrl: './sla-template-list.component.html',
	styleUrls: [ './sla-template-list.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SlaTemplateListComponent implements OnInit, OnDestroy {
	loading: boolean;
	templates: Array<any>;
	dataSource = new MatTableDataSource();
	displayedColumns = [
		'vendor',
		'name',
		'version',
		'ns',
		'expirationDate',
		'license',
		'delete'
	];
	subscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private servicePlatformService: ServicePlatformService,
		private commonService: CommonService,
		private utilsService: UtilsService
	) { }

	ngOnInit() {
		this.requestTemplates();

		// Reloads the template list every when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/service-platform/slas/sla-templates' &&
				this.route.url[ 'value' ].length === 3 &&
				this.route.url[ 'value' ][ 2 ].path === 'sla-templates'
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
     * Generates the HTTP request to get the list of SLA templates.
     *
     * @param search [Optional] SLA template attributes that
     *                          must be matched by the returned
     *                          list of templates.
     */
	async requestTemplates(search?) {
		this.loading = true;
		const response = await this.commonService.getSLATemplates(search);

		this.loading = false;
		if (response) {
			this.templates = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the SLA templates', '');
		}
	}

	async deleteTemplate(uuid) {
		this.loading = true;
		const response = await this.servicePlatformService.deleteOneSLATemplate(uuid);

		this.loading = false;
		if (response) {
			this.requestTemplates();
			this.utilsService.openSnackBar('Template deleted', '');
		} else {
			this.utilsService.openSnackBar('Unable to delete the SLA template', '');
		}
	}

	createNew() {
		this.router.navigate([ 'new' ], { relativeTo: this.route });
	}

	openTemplate(row) {
		const uuid = row.uuid;
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
