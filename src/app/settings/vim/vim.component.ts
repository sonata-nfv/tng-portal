import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { SettingsService } from '../settings.service';

@Component({
    selector: 'app-vim',
    templateUrl: './vim.component.html',
    styleUrls: [ './vim.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class VimComponent implements OnInit {
    loading: boolean;
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
    requestVims(search?) {
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

    deleteVim(uuid) {

    }

    openVim(uuid) {
        this.router.navigate([ uuid ], { relativeTo: this.route });
    }
}
