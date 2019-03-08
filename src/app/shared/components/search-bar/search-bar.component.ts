import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	ViewEncapsulation
} from '@angular/core';

@Component({
	selector: 'app-search-bar',
	templateUrl: './search-bar.component.html',
	styleUrls: [ './search-bar.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent implements OnInit {
	searchText: string;

	@Output()
	searchTextEvent = new EventEmitter<string>();
	constructor() { }

	ngOnInit() { }

	sendMessage() {
		this.searchTextEvent.emit('?' + this.searchText);
	}
}
