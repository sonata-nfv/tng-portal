import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ConfigService } from '../shared/services/config/config.service';
import { CommonService } from '../shared/services/common/common.service';
import { DashboardService } from './dashboard.service';

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
	vimData: object;
	metricName = 'vm_mem_perc';

	constructor(
		private sanitizer: DomSanitizer,
		private config: ConfigService,
		private commonService: CommonService,
		private configService: ConfigService,
		private dashboardService: DashboardService,
	) { }

	ngOnInit() {
		this.environment = this.configService.environment;
		this.requestVimUUID();

		this.environment === 'SP' ?
			this.getSPDashboardData()
			: this.getVNVDashboardData();
	}

	async requestVimUUID() {
		this.vimData = await this.dashboardService.getVimUuid(this.metricName);
	}
	getGraphUrl(panelId) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(`${ this.config.base }${ this.config.graphs }/d-solo/sp_dash/sp?orgId=1&` +
			`panelId=${ panelId }&` +
			`var-id=${ this.vimData[ 'vimUUID' ] }&` +
			`var-entity=vm&` +
			`var-env=${ this.vimData[ 'vimEnv' ] }&` +
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
