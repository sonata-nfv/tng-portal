import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material';

@Component({
	selector: 'app-select-uuid',
	templateUrl: './select-uuid.component.html',
	styleUrls: [ './select.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SelectUuidComponent implements OnInit {
	_value: string;
	@ViewChild('select') select: MatSelect;
	// Mandatory
	@Input() placeholder: string;
	@Input() list: Array<string>;
	// Optional
	@Input() required: boolean;
	@Input() disabled: boolean;
	@Input()
	set value(value: string) {
		value ? this._value = value : this._value = '';
	}
	@Input()
	set reset(reset: boolean) {
		this._value = '';
	}

	@Output() selectEvent = new EventEmitter<string>();

	constructor() { }

	ngOnInit() {
		this.select.valueChange.subscribe(value => this.onValueChanges(value));
	}

	private onValueChanges(inputValue) {
		if (inputValue) {
			this.selectEvent.emit(inputValue);
		}
	}
}
