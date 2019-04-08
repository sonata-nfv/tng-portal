import { FormControl } from '@angular/forms';

export class ControlsValidator {
	noWhitespaceValidator(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}
}
