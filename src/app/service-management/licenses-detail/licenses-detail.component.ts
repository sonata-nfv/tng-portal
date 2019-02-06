import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-licenses-detail',
    templateUrl: './licenses-detail.component.html',
    styleUrls: [ './licenses-detail.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class LicencesDetailComponent implements OnInit {
    status: string;
    licenceId: string;
    relatedService: string;
    type: string;
    description: string;

    constructor(private router: Router) { }

    ngOnInit() { }

    buy() { }

    close() {
        this.router.navigate([ 'service-management/licenses' ]);
    }
}
