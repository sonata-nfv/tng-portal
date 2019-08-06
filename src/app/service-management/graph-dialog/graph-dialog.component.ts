import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { UtilsService } from '../../shared/services/common/utils.service';
import { ServiceManagementService } from '../service-management.service';
import { ConfigService } from '../../shared/services/config/config.service';

@Component({
	selector: 'app-graph-dialog',
	templateUrl: './graph-dialog.component.html',
	styleUrls: [ './graph-dialog.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class GraphDialogComponent implements OnInit {
	loading: boolean;
	completeMetrics: Array<any>;
	functions = new Array();
	metrics: Array<any>;
	selectedFunction: string;
	selectedMetric: string;
	minutes = 30;
	refreshRate = '8s';

	constructor(
		public dialogRef: MatDialogRef<GraphDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private serviceManagementService: ServiceManagementService,
		private utilsService: UtilsService,
		private sanitizer: DomSanitizer,
		private config: ConfigService
	) { }

	ngOnInit() {
		this.getMonitoringMetrics();
	}

	async getMonitoringMetrics() {
		this.loading = true;
		const response = await this.serviceManagementService.getMonitoringMetrics(this.data.instanceUUID, this.data.vnfUUID);

		this.loading = false;
		if (response) {
			this.completeMetrics = response;
			this.functions = response.map(item => item.vduID);
		} else {
			this.utilsService.openSnackBar('Unable to fetch the monitoring data', '');
		}
	}

	receiveFunction(receivedFunction) {
		const correspondingMetrics = this.completeMetrics.find(data => data.vduID === receivedFunction);
		this.metrics = correspondingMetrics.metrics.map(item => item.__name__);
		this.selectedFunction = receivedFunction;
	}

	receiveMetric(receivedMetric) {
		this.selectedMetric = receivedMetric;
		this.getGraphUrl();
	}

	getDate() {
		return new Date().getTime();
	}

	getMinutesAgo(minutes) {
		return new Date().getTime() - (minutes * 60);
	}

	getGraphUrl() {
		const functionType = 'CNF_dash/cnf';
		const panelID = '2';

		return this.sanitizer.bypassSecurityTrustResourceUrl(
			`${ this.config.baseSP }${ this.config.graphs }/d-solo/${ functionType }?orgId=1&` +
			`from=${ this.getMinutesAgo(this.minutes) }&` +
			`to=${ this.getDate() }&` +
			`panelId=${ panelID }&` +
			`var-cnt_name=${ this.selectedFunction }&` +
			`var-metric=${ this.selectedMetric }&` +
			`theme=light&` +
			`refresh=${ this.refreshRate }`);
	}

	canShowGraph() {
		return this.selectedFunction && this.selectedMetric;
	}

	close() {
		this.dialogRef.close();
	}
}
