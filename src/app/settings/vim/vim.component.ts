import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { CommonService } from '../../shared/services/common/common.service';
import { SettingsService } from '../settings.service';

@Component({
    selector: 'app-vim',
    templateUrl: './vim.component.html',
    styleUrls: [ './vim.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class VimComponent implements OnInit, OnDestroy {
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
        private commonService: CommonService,
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
    private requestVims(search?) {
        this.loading = true;
        this.settingsService.getVims(search)
            .then(response => {
                if (response) {
                    this.loading = false;
                    this.vims = response;
                } else {
                    this.loading = false;
                    this.commonService.openSnackBar('There was an error fetching the VIMs', '');
                }
            });
    }

    createNew() {
        this.router.navigate([ 'new' ], { relativeTo: this.route });
    }

    deleteVim(uuid) {
        this.settingsService.deleteVim(uuid).then(message => {
            if (!message) {
                throw new Error();
            }
            this.commonService.openSnackBar(message, '');
            this.requestVims();
        }).catch(() => {
            this.commonService.openSnackBar('There was an error deleting the VIM', '');
        });
    }

    openVim(uuid) {
        this.router.navigate([ uuid ], { relativeTo: this.route });
    }
}
