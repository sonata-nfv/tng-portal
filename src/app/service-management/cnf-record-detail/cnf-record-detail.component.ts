import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { GraphDialogComponent } from '../graph-dialog/graph-dialog.component';

@Component({
	selector: 'app-cnf-record-detail',
	templateUrl: './cnf-record-detail.component.html',
	styleUrls: [ './cnf-record-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class CnfRecordDetailComponent implements OnInit {
	_cdus: Array<any>;
	_instanceUUID: string;
	_vnfUUID: string;
	displayedColumns = [ 'id', 'numberOfInstances', 'floatingIP', 'internalIP' ];

	/**
     * [Mandatory] Defines the connection points displayed in the table.
     */
	@Input()
	set cdus(cdus: Array<string>) {
		cdus !== undefined ? (this._cdus = cdus) : (this._cdus = new Array());
	}

	/**
     * [Mandatory] Defines the network service instance UUID
     */
	@Input()
	set instanceUUID(instanceUUID: string) {
		this._instanceUUID = instanceUUID;
	}

	/**
     * [Mandatory] Defines the function instance UUID of the opened row
     */
	@Input()
	set vnfUUID(vnfUUID: string) {
		this._vnfUUID = vnfUUID;
	}

	constructor(private graphDialog: MatDialog) { }

	ngOnInit() { }

	async openMonitoringDialog() {
		this.graphDialog.open(GraphDialogComponent, {
			data: {
				instanceUUID: this._instanceUUID, vnfUUID: this._vnfUUID
			}
		});
	}
}
