import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
	selector: 'app-sla-guarantees-detail',
	templateUrl: './sla-guarantees-detail.component.html',
	styleUrls: [ './sla-guarantees-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SlaGuaranteesDetailComponent implements OnInit {
	@Input() guarantees;

	constructor() { }

	ngOnInit() { }
}
