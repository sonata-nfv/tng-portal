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
	templates = new Array();
	dataSource = new MatTableDataSource();
	displayedColumns = [
		'vendor',
		'name',
		'version',
		'ns',
		'expirationDate',
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
	requestTemplates(search?) {
		this.loading = true;

		this.commonService
			.getSLATemplates(search)
			.then(response => {
				this.loading = false;
				this.templates = response;
			})
			.catch(err => {
				this.loading = false;
				this.utilsService.openSnackBar(err, '');
			});
	}

	deleteTemplate(uuid) {
		this.loading = true;

		this.servicePlatformService
			.deleteOneSLATemplate(uuid)
			.then(response => {
				this.utilsService.openSnackBar('Template deleted', '');
				this.requestTemplates();
			})
			.catch(err => {
				this.loading = false;
				this.utilsService.openSnackBar(err, '');
			});
	}

	createNew() {
		this.router.navigate([ 'new' ], { relativeTo: this.route });
	}

	openTemplate(row) {
		const uuid = row.uuid;
		this.router.navigate([ uuid ], { relativeTo: this.route });
	}
}
