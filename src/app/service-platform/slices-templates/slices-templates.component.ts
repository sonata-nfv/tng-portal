import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

import { SlicesInstancesCreateComponent } from '../slices-instances-create/slices-instances-create.component';

@Component({
    selector: 'app-slices-templates',
    templateUrl: './slices-templates.component.html',
    styleUrls: [ './slices-templates.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SlicesTemplatesComponent implements OnInit, OnDestroy {
    loading: boolean;
    templates = new Array();
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
    requestTemplates(search?) {
        this.loading = true;

        this.servicePlatformService
            .getSlicesTemplates(search)
            .then(response => {
                this.loading = false;
                this.templates = response;
            })
            .catch(err => {
                this.loading = false;
                this.utilsService.openSnackBar(err, '');
            });
    }

    instantiate(nst) {
        this.instantiateDialog.open(SlicesInstancesCreateComponent, {
            data: {
                nstId: nst.uuid,
                vendor: nst.vendor,
                name: nst.name,
                version: nst.version
            }
        });
    }

    deleteTemplate(uuid) {
        this.loading = true;
        this.servicePlatformService
            .deleteOneSlicesTemplate(uuid)
            .then(response => {
                this.requestTemplates();
                this.utilsService.openSnackBar('Template deleted', '');
            })
            .catch(err => {
                this.loading = false;
                this.requestTemplates();
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
