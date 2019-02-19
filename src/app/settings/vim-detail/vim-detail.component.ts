import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SettingsService } from '../settings.service';

@Component({
    selector: 'app-vim-detail',
    templateUrl: './vim-detail.component.html',
    styleUrls: [ './vim-detail.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class VimDetailComponent implements OnInit {
    loading: boolean;
    detail = {};

    constructor(
        private settingsService: SettingsService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const uuid = params[ 'id' ];
            this.requestVim(uuid);
        });
    }

    /**
     * Generates the HTTP request of a VIM by UUID.
     *
     * @param uuid ID of the selected VIM to be displayed.
     *             Comming from the route.
     */
    requestVim(uuid) {
        this.loading = true;
        this.settingsService
            .getOneVim(uuid)
            .then(response => {
                this.loading = false;
                this.detail = Object.assign({}, response);
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
