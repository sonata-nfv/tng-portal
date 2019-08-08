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
	minutes = 45;
	refreshRateGraphs = '30s';
	refreshRateRequests = 3000;
	nsd: string;
	vnfd: string;
	uptime: string;
	nstd: string;
	rpd: string;
	slad: string;
	runningSlices: string;
	runningNS: string;
	runningFunctions: string;

	constructor(
		private sanitizer: DomSanitizer,
		private config: ConfigService,
		private commonService: CommonService) { }

	ngOnInit() {
		this.getDashboardData();


	}

	getDate() {
		return new Date().getTime();
	}

	getMinutesAgo(minutes) {
		return new Date().getTime() - (minutes * 60);
	}

	getGraphUrl(panelId) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(`${ this.config.baseSP }${ this.config.graphs }/d-solo/sp_dash/sp?orgId=1&` +
			`panelId=${ panelId }&` +
			`from=getFifteenMinutesAgo()&` +
			`to=getDate()&` +
			`var-id=341f4d56-8e66-cfae-6fb3-1143fff11091&` +
			`var-entity=vm&` +
			`var-env=pre-int-sp%3A341f4d56-8e66-cfae-6fb3-1143fff11091&` +
			`theme=light&` +
			`refresh=${ this.refreshRateGraphs }`);
	}

	async getDashboardData() {
		console.log('requesting everything');
		this.uptime = await this.commonService.getPlatformUptime();
		this.nstd = await this.commonService.getNSTDNumber();
		this.nsd = await this.commonService.getNSDNumber();
		this.vnfd = await this.commonService.getVNFDNumber();
		this.rpd = await this.commonService.getRPDNumber();
		this.slad = await this.commonService.getSLADNumber();
		this.runningSlices = await this.commonService.getRunningSlices();
		this.runningNS = await this.commonService.getRunningNS();
		this.runningFunctions = await this.commonService.getRunningFunctions();

		// setTimeout(this.getDashboardData, 50000);
	}


	// 	async function newCalll () {
	// console.log('requesting everything')
	// await llamada1();
	// await llamada2();
	// await llamada31();
	// ….
	// setTimeout(newCalll, 3000);
	// }
	// newCalll();
}
