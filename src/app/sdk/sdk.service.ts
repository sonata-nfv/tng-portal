import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class SdkService {
	// see guide here: https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/
	private fileUrlsSource = new BehaviorSubject([]);
	currentFileUrls = this.fileUrlsSource.asObservable();

	constructor() { }

	// set new file URLs
	updateFiles(fileUrls: Array<string>) {
		this.fileUrlsSource.next(fileUrls);
	}
}
