import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ConfigService } from '../shared/services/config/config.service';
import { CommonService } from '../shared/services/common/common.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
	minutes = 30;
	refreshRateGraphs = '30s';
	// refreshRateRequests = 60000;
	dashboardData = { };
	uptime: string;
	// getDataTimeOut;

	constructor(
		private sanitizer: DomSanitizer,
		private config: ConfigService,
		private commonService: CommonService) { }

	ngOnInit() {
		this.getDashboardData();
		// this.getDataTimeOut = setTimeout(() => { this.getDashboardData(); }, this.refreshRateRequests);
	}

	ngOnDestroy() {
		// clearTimeout(this.getDataTimeOut);
	}

	getDate() {
		return new Date().getTime();
	}

	getMinutesAgo(minutes) {
		return new Date().getTime() - (minutes * 60000);
	}

	getGraphUrl(panelId) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(`${ this.config.baseSP }${ this.config.graphs }/d-solo/sp_dash/sp?orgId=1&` +
			`panelId=${ panelId }&` +
			`from=${ this.getMinutesAgo(this.minutes) }&` +
			`to=${ this.getDate() }&` +
			`var-id=341f4d56-8e66-cfae-6fb3-1143fff11091&` +
			`var-entity=vm&` +
			`var-env=pre-int-sp%3A341f4d56-8e66-cfae-6fb3-1143fff11091&` +
			`theme=light&` +
			`refresh=${ this.refreshRateGraphs }`);
	}

	async getDashboardData() {
		this.dashboardData = await this.commonService.getDashboardData();
	}
}
