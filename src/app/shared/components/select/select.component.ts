import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: [ './select.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements OnInit {
	_value: string;
	_selectOfStrings = false;
	@ViewChild('select') select: MatSelect;
	// Mandatory
	@Input() placeholder: string;
	@Input() list: Array<string>;
	@Input()
	set selectOfStrings(selectOfStrings: boolean) {
		this._selectOfStrings = selectOfStrings;
	}
	// Optional
	@Input() required: boolean;
	@Input() disabled: boolean;
	@Input()
	set value(value: string) {
		value ? this._value = value : this._value = '';
	}
	@Input()
	set reset(reset: boolean) {
		if (reset) {
			this._value = '';
		}
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
