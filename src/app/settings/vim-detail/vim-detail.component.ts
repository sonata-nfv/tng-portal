import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SettingsService } from '../settings.service';
import { UtilsService } from '../../shared/services/common/utils.service';

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
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute
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
    private requestVim(uuid) {
        this.loading = true;
        this.settingsService
            .getOneVim(uuid)
            .then(response => {
                this.loading = false;
                if (response) {
                    this.detail = Object.assign({}, response);
                } else {
                    this.close();
                }
            })
            .catch(() => {
                this.loading = false;
                this.close();
            });
    }

    copyToClipboard() {
        this.utilsService.copyToClipboard(JSON.stringify(this.detail[ 'config' ]));
    }

    deleteVim() {
        this.loading = true;
        this.settingsService.deleteVim(this.detail[ 'uuid' ]).then(message => {
            this.loading = false;
            if (!message) {
                throw new Error();
            }
            this.utilsService.openSnackBar(message, '');
            this.close();
        }).catch(() => {
            this.loading = false;
            this.utilsService.openSnackBar('There was an error deleting the VIM', '');
        });
    }

    close() {
        this.router.navigate([ '../' ], { relativeTo: this.route });
    }

}
