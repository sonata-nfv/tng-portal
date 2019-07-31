import { Directive, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[appTrim]'
})
export class TrimFormValuesDirective {
	@Input('appTrim') form;

	/**
	 * Updates the value on the input event.
	 */
	@HostListener('input', [ '$event.type', '$event.target.value' ])
	onInput(event: string, value: string): void {
		this.updateValue(value);
	}

	constructor() { }

	/**
	 * Trims an input value, and sets it to the element.
	 *
	 * @param {string} value - input value
	 */
	private updateValue(value: string): void {
		// Receives the new value and sets it in the form
		const _value = value.replace(/ /g, '');
		this.form.get('floatingIpRanging').setValue(_value);
	}
}
