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
	loading: boolean;
	refreshRateGraphs = '10s';
	dashboardData = { };
	uptime: string;
	environment: string;
	vimData: object;
	metricName = 'vm_mem_perc';
	unknown = '-';

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
		this.loading = true;

		const responses = await Promise.all([
			this.commonService.getNSTDNumber(),
			this.commonService.getNSDNumber(),
			this.commonService.getVNFDNumber(),
			this.commonService.getRPDNumber(),
			this.commonService.getSLADNumber(),
			this.commonService.getRunningSlices(),
			this.commonService.getRunningNS(),
			this.commonService.getRunningFunctions(),
			this.commonService.getPolicyAlertsNumber(),
		]);

		this.dashboardData[ 'nstd' ] = responses[ 0 ];
		this.dashboardData[ 'nsd' ] = responses[ 1 ];
		this.dashboardData[ 'vnfd' ] = responses[ 2 ];
		this.dashboardData[ 'rpd' ] = responses[ 3 ];
		this.dashboardData[ 'slad' ] = responses[ 4 ];
		this.dashboardData[ 'runningSlices' ] = responses[ 5 ];
		this.dashboardData[ 'runningNS' ] = responses[ 6 ];
		this.dashboardData[ 'runningFunctions' ] = responses[ 7 ];
		this.dashboardData[ 'policyAlerts' ] = responses[ 8 ];

		this.loading = false;
	}

	async getVNVDashboardData() {
		this.loading = true;

		const responses = await Promise.all([
			this.commonService.getTDNumber(),
			this.commonService.getNSDNumber(),
			this.commonService.getVNFDNumber(),
			this.commonService.getTestsNumber('COMPLETED'),
			this.commonService.getTestsNumber('STARTING'),
			this.commonService.getTestsNumber('WAITING_FOR_CONFIRMATION'),
			this.commonService.getTestsNumber('SCHEDULED'),
			this.commonService.getTestsNumber('ERROR'),
			this.commonService.getPlatformsNumber(),
		]);

		this.dashboardData[ 'testd' ] = responses[ 0 ];
		this.dashboardData[ 'nsd' ] = responses[ 1 ];
		this.dashboardData[ 'vnfd' ] = responses[ 2 ];
		this.dashboardData[ 'testsCompleted' ] = responses[ 3 ];
		this.dashboardData[ 'testsInProgress' ] = responses[ 4 ];
		this.dashboardData[ 'testsWaitingForConfirmation' ] = responses[ 5 ];
		this.dashboardData[ 'testsScheduled' ] = responses[ 6 ];
		this.dashboardData[ 'testsFailed' ] = responses[ 7 ];

		const platforms = responses[ 8 ];
		if (platforms && Object.keys(platforms).length) {
			this.dashboardData[ 'sonataPlatforms' ] = platforms[ 'SONATA' ].toString();
			this.dashboardData[ 'osmPlatforms' ] = platforms[ 'OSM' ].toString();
			this.dashboardData[ 'onapPlatforms' ] = platforms[ 'ONAP' ].toString();
		} else {
			this.dashboardData[ 'sonataPlatforms' ] = this.unknown;
			this.dashboardData[ 'osmPlatforms' ] = this.unknown;
			this.dashboardData[ 'onapPlatforms' ] = this.unknown;
		}

		this.loading = false;
	}

	canShowGraphsError() {
		return (this.vimData && Object.keys(this.vimData).length && !this.loading) ? false : true;
	}
}
