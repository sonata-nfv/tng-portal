import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';


@Component({
	selector: 'app-main-page',
	templateUrl: './main-page.component.html',
	styleUrls: ['./main-page.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MainPageComponent implements OnInit {

	constructor(
		private router: Router,
	) { }

	ngOnInit() { }

	createPackage() {
		this.router.navigate(['sdk/descriptor-generator']);
	}
}
