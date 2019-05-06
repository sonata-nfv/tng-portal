import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ConfigService } from '../shared/services/config/config.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
	section = 'vm';
	minutes = 30;
	refreshRate = '5s';

	constructor(private sanitizer: DomSanitizer, private config: ConfigService) { }

	ngOnInit() {
		console.log('Requesting graphs to ', this.config.baseMonitoring);
	}

	getDate() {
		return new Date().getTime();
	}

	getMinutesAgo(minutes) {
		return new Date().getTime() - (minutes * 60);
	}

	getGraphUrl(panelId) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(`${ this.config.baseMonitoring }/d-solo/sp_dash/sp?orgId=1&` +
			`panelId=${ panelId }&` +
			`from=getFifteenMinutesAgo()&` +
			`to=getDate()&` +
			`var-id=341f4d56-8e66-cfae-6fb3-1143fff11091&` +
			`var-entity=vm&` +
			`var-env=pre-int-sp%3A341f4d56-8e66-cfae-6fb3-1143fff11091&` +
			`theme=light&` +
			`refresh=${ this.refreshRate }`);
	}

	setSection(e, buttonId) {
		this.section = buttonId;
	}
}
