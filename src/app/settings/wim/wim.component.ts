import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { SettingsService } from '../settings.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
    selector: 'app-wim',
    templateUrl: './wim.component.html',
    styleUrls: [ './wim.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class WimComponent implements OnInit, OnDestroy {
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
        private commonService: CommonService,
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
    private requestWims(search?) {
        this.loading = true;
        this.settingsService.getWims(search)
            .then(response => {
                if (response) {
                    this.loading = false;
                    this.wims = response;
                } else {
                    this.loading = false;
                    this.commonService.openSnackBar('There was an error fetching the WIMs', '');
                }
            });
    }

    createNew() {
        this.router.navigate([ 'new' ], { relativeTo: this.route });
    }

    deleteWim(uuid) {
        this.settingsService.deleteWim(uuid).then(message => {
            if (!message) {
                throw new Error();
            }
            this.commonService.openSnackBar(message, '');
            this.requestWims();
        }).catch(() => {
            this.commonService.openSnackBar('There was an error deleting the WIM', '');
        });
    }

    openWim(uuid) {
        this.router.navigate([ uuid ], { relativeTo: this.route });
    }
}
