import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ConfigService } from '../shared/services/config/config.service';
import { CommonService } from '../shared/services/common/common.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
	refreshRateGraphs = '10s';
	dashboardData = { };
	uptime: string;
	environment: string;

	constructor(
		private sanitizer: DomSanitizer,
		private config: ConfigService,
		private commonService: CommonService,
		private configService: ConfigService) { }

	ngOnInit() {
		this.environment = this.configService.environment;

		this.environment === 'SP' ?
			this.getSPDashboardData()
			: this.getVNVDashboardData();
	}

	getSPGraphUrl(panelId) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(`${ this.config.baseSP }${ this.config.graphs }/d-solo/sp_dash/sp?orgId=1&` +
			`panelId=${ panelId }&` +
			`var-id=341f4d56-8e66-cfae-6fb3-1143fff11091&` +
			`var-entity=vm&` +
			`var-env=pre-int-sp%3A341f4d56-8e66-cfae-6fb3-1143fff11091&` +
			`theme=light&` +
			`refresh=${ this.refreshRateGraphs }`);
	}

	getVNVGraphUrl(panelId) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(`${ this.config.baseVNV }${ this.config.graphs }/d-solo/sp_dash/sp?orgId=1&` +
			`panelId=${ panelId }&` +
			`var-id=4fd837f6-5f49-11dc-a9ed-000ea629289b&` +
			`var-entity=vm&` +
			`var-env=pre-int-vnv-bcn.5gtango.eu%3A4fd837f6-5f49-11dc-a9ed-000ea629289b&` +
			`theme=light&` +
			`refresh=${ this.refreshRateGraphs }`);
	}

	async getSPDashboardData() {
		this.dashboardData = await this.commonService.getSPDashboardData();
	}

	async getVNVDashboardData() {
		this.dashboardData = await this.commonService.getVNVDashboardData();
	}
}
