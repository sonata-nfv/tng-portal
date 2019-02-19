import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SettingsService } from '../settings.service';

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
    requestWim(uuid) {
        this.loading = true;
        this.settingsService
            .getOneWim(uuid)
            .then(response => {
                this.loading = false;
                this.detail = Object.assign({}, response);
                this.detail[ 'vim_list' ] = this.detail[ 'vim_list' ].toString().replace(/,/g, '\n');
            })
            .catch(() => {
                this.loading = false;
                this.close();
            });
    }

    close() {
        this.router.navigate([ '../' ], { relativeTo: this.route });
    }

}
