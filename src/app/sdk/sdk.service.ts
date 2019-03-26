import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SdkService {

	constructor(
		private http: HttpClient
	) { }

}
