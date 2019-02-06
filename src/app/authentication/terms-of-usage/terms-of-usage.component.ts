import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-terms-of-usage',
    templateUrl: './terms-of-usage.component.html',
    styleUrls: [ './terms-of-usage.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TermsOfUsageComponent implements OnInit {
    @Output()
    showTermsEvent = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit() { }

    close() {
        this.showTermsEvent.emit(false);
    }
}
