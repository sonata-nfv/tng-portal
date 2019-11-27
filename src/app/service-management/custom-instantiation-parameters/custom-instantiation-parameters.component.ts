import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-custom-instantiation-parameters',
	templateUrl: './custom-instantiation-parameters.component.html',
	styleUrls: [ './custom-instantiation-parameters.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class CustomInstantiationParametersComponent implements OnInit {
	_customParameters = { };
	customParameterForm: FormGroup;
	@Input()
	set customParameters(customParameters: object) {
		if (customParameters) {
			this._customParameters = customParameters;
		}
	}
	@Input()
	set resetForm(resetForm: boolean) {
		if (resetForm) {
			this.customParameterForm.reset();
		}
	}

	@Output() customParametersEvent = new EventEmitter<object>();

	constructor() { }

	ngOnInit() {
		this.customParameterForm = new FormGroup({
			key: new FormControl('', Validators.required),
			value: new FormControl('', Validators.required)
		});
	}

	onAdd() {
		const key = this.customParameterForm.get('key').value;
		const value = this.customParameterForm.get('value').value;
		this._customParameters[ key ] = value;
		this.customParameterForm.reset();
		this.fireCustomParametersEvent();
	}

	eraseParam(item) {
		delete this._customParameters[ item.key ];
		this.fireCustomParametersEvent();
	}

	fireCustomParametersEvent() {
		this.customParametersEvent.emit(this._customParameters);
	}
}
