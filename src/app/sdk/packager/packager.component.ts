import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SdkService } from '../sdk.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
	selector: 'app-packager',
	templateUrl: './packager.component.html',
	styleUrls: ['./packager.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PackagerComponent implements OnInit {
	projectUuid: string;
	skipValidation = false;
	pkgOutput = 'Packaging not started yet';
	pkgPath: string;
	pkgSuccess: boolean;
	// TODO: move this to a new environment in the environments folder and use angular configuration instead
	baseip = 'http://192.168.99.100';

	constructor(private sdkService: SdkService, private http: HttpClient) {
		this.pkgSuccess = false;
	}

	ngOnInit() {
		this.projectUuid = this.sdkService.project.uuid;
	}

	// start packaging
	package(): void {
		const endpoint = this.baseip + ':5098/api/v1/projects/' + this.projectUuid + '/package';
		const header = new HttpHeaders()
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.set('Access-Control-Allow-Origin', this.baseip + ':5098');

		// skip validation if selected (add mat-checkbox)
		const body = new HttpParams().set('skip_validation', String(this.skipValidation));

		// update icon to show progress circle
		if (this.skipValidation) {
			this.pkgOutput = 'Packaging without validation...';
		} else {
			this.pkgOutput = 'Valdiating and packaging...';
		}

		this.http.post(endpoint, body.toString(), { headers: header })
			.subscribe(response => {
				console.log(response);
				if (response['error_msg'] == null) {
					this.pkgOutput = 'Success';
					this.pkgPath = response['package_path'];
					this.pkgSuccess = true;
				} else {
					this.pkgOutput = response['error_msg'];
				}
			});
	}

	onboardPackage(): void {
		console.log('On-boarding not yet implemented');
	}

	downloadPackage(): void {
		const endpoint = this.baseip + ':5098/api/v1/' + this.pkgPath;
		window.open(endpoint);
	}
}
