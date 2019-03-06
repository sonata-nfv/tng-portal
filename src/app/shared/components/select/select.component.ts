import {
	Component,
	OnInit,
	ViewEncapsulation,
	Output,
	EventEmitter,
	Input
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-select',
	templateUrl: './select.component.html',
	styleUrls: [ './select.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements OnInit {
	_disabled = false;
	_required = true;
	select = new FormControl({
		disabled: this._disabled,
		required: this._required
	});

	/**
     * [Optional] Resets the form whenever active
     */
	@Input()
	set reset(reset: boolean) {
		if (reset) {
			this.select.reset();
		}
	}
	/**
     * [Optional] Disables the select whenever active
     */
	@Input()
	set disabled(disabled: boolean) {
		this._disabled = disabled;
		if (disabled) {
			this.select.disable();
		} else {
			this.select.enable();
		}
	}
	/**
     * [Optional] Marks the select field as required whenever active
     */
	@Input()
	set required(required: boolean) {
		this._required = required;
	}
	/**
     * [Optional] Fixes the initial value whenever set
     */
	@Input()
	set value(item: string) {
		this.select.setValue(item);
	}
	/**
     * [Mandatory] Defines the placeholder for the select.
     */
	@Input()
	placeholder: string;
	/**
     * [Mandatory] Defines the list displayed in the select.
     */
	@Input()
	list: Array<string>;
	/**
     * Provides the selected element.
     */
	@Output()
	selectEvent = new EventEmitter<string>();
	constructor() { }

	ngOnInit() {
		this.select.valueChanges.subscribe(value => this._onFormChanges(value));
	}

	private _onFormChanges(values) {
		if (
			values != null &&
			values !== undefined &&
			!(values.hasOwnProperty('disabled') || values.hasOwnProperty('required'))
		) {
			this.selectEvent.emit(values);
		}
	}
}
