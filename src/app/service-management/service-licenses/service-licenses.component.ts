import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-service-licenses',
	templateUrl: './service-licenses.component.html',
	styleUrls: ['./service-licenses.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ServiceLicensesComponent implements OnInit {
	searchText: string;

	constructor() {}

	ngOnInit() {}

	receiveMessage($event) {
		this.searchText = $event;
	}
}
