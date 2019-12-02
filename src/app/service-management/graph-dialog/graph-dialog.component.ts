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
		if (response && response.length) {
			this.completeMetrics = response;
			this.functions = response.map(item => item.vduID);
		} else {
			this.utilsService.openSnackBar('Unable to fetch the monitoring data', '');
			this.close();
		}
	}

	receiveFunction(receivedFunction) {
		const correspondingMetrics = this.completeMetrics.find(data => data.vduID === receivedFunction);
		this.metrics = correspondingMetrics.metrics.map(item => item.__name__);
		this.selectedFunction = receivedFunction;

		if (!this.metrics.length) {
			this.utilsService.openSnackBar('Unable to find any metric to be measured nor graph to be displayed for this instance', '');
		}
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
		const functionType = this.data.type === 'vnf' ? 'VNF_sp/vnf' : 'CNF_dash/cnf';
		const id = this.data.type === 'vnf' ?
			`var-id=${ this.selectedFunction }&`
			: `var-cnt_name=${ this.selectedFunction }&`;
		const panelID = '2';

		return this.sanitizer.bypassSecurityTrustResourceUrl(
			`${ this.config.baseSP }${ this.config.graphs }/d/${ functionType }?orgId=1&` +
			`from=${ this.getMinutesAgo(this.minutes) }&` +
			`to=${ this.getDate() }&` +
			`panelId=${ panelID }&` +
			id +
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
