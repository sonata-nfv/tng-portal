import { Component, OnInit, ViewEncapsulation } from '@angular/core';

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

    constructor() { }

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

    }

    deleteVim(uuid) {

    }
}
