import { FormControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';


@Directive({
	selector: '[appControlsValidator]',
	providers: [ControlsValidatorDirective]
})
export class ControlsValidatorDirective {
	noWhitespaceValidator(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}
}
