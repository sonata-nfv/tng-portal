import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { ServiceManagementService } from '../service-management.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-cnf-record-detail',
	templateUrl: './cnf-record-detail.component.html',
	styleUrls: [ './cnf-record-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class CnfRecordDetailComponent implements OnInit {
	loading: boolean;
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

	constructor(
		private serviceManagementService: ServiceManagementService,
		private utilsService: UtilsService
	) { }

	ngOnInit() { }

	async openMonitoringDialog() {
		this.loading = true;
		const response = await this.serviceManagementService.getMonitoringMetrics(this._instanceUUID, this._vnfUUID);

		this.loading = false;
		if (response) {
			console.log(response);

			// TODO open the specific dialog to show the graphs
		} else {
			this.utilsService.openSnackBar('Unable to fetch the monitoring data', '');
		}
	}
}
