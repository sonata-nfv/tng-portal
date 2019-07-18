import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
	selector: 'app-cnf-record-detail',
	templateUrl: './cnf-record-detail.component.html',
	styleUrls: [ './cnf-record-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class CnfRecordDetailComponent implements OnInit {
	_cdus: Array<any>;
	displayedColumns = [ 'id', 'numberOfInstances', 'floatingIP', 'internalIP' ];

	/**
     * [Mandatory] Defines the connection points displayed in the table.
     */
	@Input()
	set cdus(cdus: Array<string>) {
		cdus !== undefined ? (this._cdus = cdus) : (this._cdus = new Array());
	}

	constructor() { }

	ngOnInit() { }
}
