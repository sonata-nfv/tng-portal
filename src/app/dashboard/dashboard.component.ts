import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
	minutes = 30;
	refreshRate = '5s';

	constructor(private sanitizer: DomSanitizer) {
	}

	ngOnInit() { }

	getDate() {
		return new Date().getTime();
	}

	getMinutesAgo(minutes) {
		return new Date().getTime() - (minutes * 60);
	}

	getGraphUrl(panelId) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(`http://pre-int-sp-ath.5gtango.eu:3000/d-solo/SP_dash1/sp?orgId=1&` +
			`panelId=${ panelId }&` +
			`from=getFifteenMinutesAgo()&` +
			`to=getDate()&` +
			`var-id=341f4d56-8e66-cfae-6fb3-1143fff11091&` +
			`var-entity=vm&` +
			`var-env=pre-int-sp%3A341f4d56-8e66-cfae-6fb3-1143fff11091&` +
			`theme=light&` +
			`refresh=${ this.refreshRate }`);
	}

}
