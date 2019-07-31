import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
	selector: 'app-sla-license-detail',
	templateUrl: './sla-license-detail.component.html',
	styleUrls: [ './sla-license-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SlaLicenseDetailComponent implements OnInit {
	@Input() license;
	@Input() licenseExpirationDate;
	@Input() licenseInstances;

	constructor() { }

	ngOnInit() { }
}
