import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SdkService {

	private filesSource = new BehaviorSubject([]);
	files = this.filesSource.asObservable();

	changeFiles(files: any) {
		this.filesSource.next(files);
	}

	constructor(
		private http: HttpClient
	) { }

}
