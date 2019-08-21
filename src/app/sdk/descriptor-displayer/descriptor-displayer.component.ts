import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-descriptor-displayer',
	templateUrl: './descriptor-displayer.component.html',
	styleUrls: ['./descriptor-displayer.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DescriptorDisplayerComponent implements OnInit {
	constructor(private router: Router) { }

	ngOnInit() { }

	package(): void {
		this.router.navigate(['sdk/packager']);
	}
}
