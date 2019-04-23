import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
	selector: 'app-vnf-record-detail',
	templateUrl: './vnf-record-detail.component.html',
	styleUrls: [ './vnf-record-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VnfRecordDetailComponent implements OnInit {
	_vdus: Array<any>;
	displayedColumns = [ 'id', 'type', 'mac', 'ip' ];

	/**
     * [Mandatory] Defines the connection points displayed in the table.
     */
	@Input()
	set vdus(vdus: Array<string>) {
		vdus !== undefined ? (this._vdus = vdus) : (this._vdus = new Array());
	}

	constructor() { }

	ngOnInit() { }
}
