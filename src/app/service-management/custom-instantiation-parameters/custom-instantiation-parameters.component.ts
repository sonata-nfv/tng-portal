import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-custom-instantiation-parameters',
	templateUrl: './custom-instantiation-parameters.component.html',
	styleUrls: [ './custom-instantiation-parameters.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class CustomInstantiationParametersComponent implements OnInit {
	_customParameters = new Array<object>();
	customParameterForm: FormGroup;
	@Input()
	set customParameters(customParameters: Array<object>) {
		if (customParameters && customParameters.length) {
			this._customParameters = customParameters;
		}
	}
	@Output() customParametersEvent = new EventEmitter<Array<object>>();

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
		this._customParameters.push({ [ key ]: value });
		this.customParameterForm.reset();
		this.fireCustomParametersEvent();
	}

	fireCustomParametersEvent() {
		this.customParametersEvent.emit(this._customParameters);
	}
}
