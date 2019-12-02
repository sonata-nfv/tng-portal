import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { GraphDialogComponent } from '../graph-dialog/graph-dialog.component';

@Component({
	selector: 'app-vnf-record-detail',
	templateUrl: './vnf-record-detail.component.html',
	styleUrls: [ './vnf-record-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VnfRecordDetailComponent implements OnInit {
	_vdus: Array<any>;
	_instanceUUID: string;
	_vnfUUID: string;
	displayedColumns = [ 'id', 'type', 'mac', 'ip' ];

	/**
     * [Mandatory] Defines the connection points displayed in the table.
     */
	@Input()
	set vdus(vdus: Array<string>) {
		vdus ? (this._vdus = vdus) : (this._vdus = new Array());
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
				type: 'vnf', instanceUUID: this._instanceUUID, vnfUUID: this._vnfUUID
			}
		});
	}
}
