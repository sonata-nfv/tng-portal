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
	// Mandatory
	@Input() placeholder: string;

	// Optional
	@Input() required: boolean;
	@Input() value: string;
	@Input() list: Array<string>;
	@Input()
	set disabled(disabled: boolean) {
		disabled ? this.select.disable() : this.select.enable();
	}
	@Input()
	set reset(reset: boolean) {
		if (reset) {
			this.select.reset();
		}
	}

	@Output() selectEvent = new EventEmitter<string>();

	select = new FormControl({ value: this.value, disabled: this.disabled || false, required: this.required || false });

	constructor() { }

	ngOnInit() {
		this.select.valueChanges.subscribe(value => this.onFormChanges(value));
	}

	private onFormChanges(values) {
		if (values) {
			this.selectEvent.emit(values);
		}
	}
}
