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
		if (customParameters) {
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

	getObjectString(object) {
		return `${ Object.keys(object)[ 0 ] }:${ object[ Object.keys(object)[ 0 ] ] }`;
	}

	onAdd() {
		const key = this.customParameterForm.get('key').value;
		const value = this.customParameterForm.get('value').value;
		this._customParameters.push({ [ key ]: value });
		this.customParameterForm.reset();
		this.fireCustomParametersEvent();
	}

	eraseParam(param) {
		this._customParameters = this._customParameters.filter(o => o !== param);
		this.fireCustomParametersEvent();
	}

	fireCustomParametersEvent() {
		this.customParametersEvent.emit(this._customParameters);
	}
}
