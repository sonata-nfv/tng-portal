import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-nap-lists',
	templateUrl: './nap-lists.component.html',
	styleUrls: [ './nap-lists.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class NapListsComponent implements OnInit {
	listName = 'ingress';
	@Input() ingress: Array<object>;
	@Input() egress: Array<object>;
	@Input() blacklist: Array<object>;
	@Output() listNameEvent = new EventEmitter<string>();

	constructor() { }

	ngOnInit() {
		this.sendListName(this.listName);
	}

	sendListName(listName) {
		this.listName = listName;
		this.listNameEvent.emit(this.listName);
	}
}