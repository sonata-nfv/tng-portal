import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UtilsService {
	emailPattern = '[a-zA-Z0-9.-._]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';
	ipPattern = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
	maskPattern = '([1-9]|1[0-9]|2[0-9]|3[2])';
	ipAndMaskPattern = `${ this.ipPattern }\/${ this.maskPattern }`;
	ipRangePattern = `${ this.ipPattern }-${ this.ipPattern }(,${ this.ipPattern }-${ this.ipPattern })*`;
	numberPattern = '^[0-9]*$';

	constructor(
		public snackBar: MatSnackBar
	) { }

	getEmailPattern() {
		return this.emailPattern;
	}

	getIpPattern() {
		return this.ipPattern;
	}

	getMaskPattern() {
		return this.maskPattern;
	}

	getIpAndMaskPattern() {
		return this.ipAndMaskPattern;
	}

	getIpRangePattern() {
		return this.ipRangePattern;
	}

	getNumberPattern() {
		return this.numberPattern;
	}

	/**
    * Formats a string so that only the first letter is a capital one
    *
    * @param str string to parse
    */
	capitalizeFirstLetter(str): string {
		if (!str) {
			return;
		}
		if (str.includes('_')) {
			str = str.replace(/_/g, ' ');
		}
		if (str.includes('-')) {
			str = str.replace(/-/g, ' ');
		}

		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}

	/**
     * Copies the selected value to the clipboard
     *
     * @param value Value to copy to clipboard
     */
	copyToClipboard(value) {
		const el = document.createElement('textarea');
		el.value = value;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
		this.openSnackBar('Copied', '');
	}

	/**
     * Opens a snack bar for notifications on the bottom of the screen
     *
     * @param message Message to be displayed
     * @param action Action displayed in the button
     */
	openSnackBar(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 5000
		});
	}

	/**
     * Compares two objects property to property
     *
     * @param obj1 First object to compare
     * @param obj2 Second object to compare
     */
	compareObjects(obj1, obj2) {
		const obj1Props = Object.getOwnPropertyNames(obj1);
		const obj2Props = Object.getOwnPropertyNames(obj2);

		if (obj1Props.length !== obj2Props.length) {
			return false;
		}

		for (const prop of obj1Props) {
			if (obj1[ prop ] instanceof Array && obj2[ prop ] instanceof Array) {
				if (obj1[ prop ].length !== obj2[ prop ].length) {
					return false;
				} else {
					for (const value of obj1[ prop ]) {
						if (!obj2[ prop ].includes(value)) {
							return false;
						}
					}
				}
			} else if (obj1[ prop ] !== obj2[ prop ]) {
				return false;
			}
		}

		return true;
	}

	isValidJSON(object) {
		try {
			if (object) {
				JSON.parse(object);
			}
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
     * Compares two objects property to property and returns the differences in the second one
     *
     * @param obj1 Old object
     * @param obj2 New object
     */
	getObjectDifferences(obj1, obj2) {
		const obj1Props = Object.getOwnPropertyNames(obj1);
		const result = { };

		for (const prop of obj1Props) {
			if (obj1[ prop ] !== obj2[ prop ] && obj2[ prop ]) {
				result[ prop ] = obj2[ prop ];
			}
		}

		return result;
	}

	/**
     * Prepares the received date to be displayed in the screen
     *
     * @param dateIn Date to be displayed
     */
	formatUTCDate(dateIn) {
		return new Date(dateIn).toUTCString();
	}

	formatDateString(dateIn) {
		return new Date(dateIn).toDateString();
	}

	urlEncode(obj: Object): string {
		let str = '';
		Object.keys(obj).forEach(key => {
			if (obj[ key ] instanceof Array) {
				obj[ key ].forEach(item => {
					str +=
						(str.length > 0 ? '&' : '') +
						encodeURI(key) +
						'=' +
						encodeURI(item);
				});
			} else {
				str +=
					(str.length > 0 ? '&' : '') +
					encodeURI(key) +
					'=' +
					encodeURI(obj[ key ]);
			}
		});
		return str;
	}
}
