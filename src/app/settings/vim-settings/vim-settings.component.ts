import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CommonService } from '../../shared/services/common/common.service';
import { SettingsService } from '../settings.service';

@Component({
    selector: 'app-vim-settings',
    templateUrl: './vim-settings.component.html',
    styleUrls: [ './vim-settings.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class VimSettingsComponent implements OnInit {
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

    constructor(private settingsService: SettingsService, private commonService: CommonService) { }

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
                this.loading = false;
                this.vims = response;
            })
            .catch(error => {
                this.loading = false;
                console.error(error);
                this.commonService.openSnackBar('There was an error fetching the slice instances', '');
            });
    }

    deleteVim(uuid) {

    }
}
