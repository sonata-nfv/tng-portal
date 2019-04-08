export class Validator {
	noWhitespaceValidator(text: string) {
		const isWhitespace = (text || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}
}
