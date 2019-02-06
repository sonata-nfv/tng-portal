import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-user-licenses',
    templateUrl: './user-licenses.component.html',
    styleUrls: [ './user-licenses.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class UserLicensesComponent implements OnInit {
    searchText: string;

    constructor() { }

    ngOnInit() { }

    receiveMessage($event) {
        this.searchText = $event;
    }
}
