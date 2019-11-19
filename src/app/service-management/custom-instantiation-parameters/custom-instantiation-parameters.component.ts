import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-custom-instantiation-parameters',
	templateUrl: './custom-instantiation-parameters.component.html',
	styleUrls: [ './custom-instantiation-parameters.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class CustomInstantiationParametersComponent implements OnInit {
	constructor() { }

	ngOnInit() { }
}
