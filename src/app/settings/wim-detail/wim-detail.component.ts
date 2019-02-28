import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SettingsService } from '../settings.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
    selector: 'app-wim-detail',
    templateUrl: './wim-detail.component.html',
    styleUrls: [ './wim-detail.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class WimDetailComponent implements OnInit {
    loading: boolean;
    detail = {};

    constructor(
        private settingsService: SettingsService,
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const uuid = params[ 'id' ];
            this.requestWim(uuid);
        });
    }

    /**
     * Generates the HTTP request of a WIM by UUID.
     *
     * @param uuid ID of the selected WIM to be displayed.
     *             Comming from the route.
     */
    private requestWim(uuid) {
        this.loading = true;
        this.settingsService
            .getOneWim(uuid)
            .then(response => {
                this.loading = false;
                if (response) {
                    this.detail = Object.assign({}, response);
                    this.detail[ 'vim_list' ] = this.detail[ 'vim_list' ].toString().replace(/,/g, '\n');
                } else {
                    this.close();
                }
            })
            .catch(() => {
                this.loading = false;
                this.close();
            });
    }

    copyToClipboard(value) {
        this.utilsService.copyToClipboard(value);
    }

    deleteWim() {
        this.loading = true;
        this.settingsService.deleteWim(this.detail[ 'uuid' ]).then(message => {
            this.loading = false;
            if (!message) {
                throw new Error();
            }
            this.utilsService.openSnackBar(message, '');
            this.close();
        }).catch(() => {
            this.loading = false;
            this.utilsService.openSnackBar('There was an error deleting the WIM', '');
        });
    }

    close() {
        this.router.navigate([ '../' ], { relativeTo: this.route });
    }

}
