import { Component, OnInit } from '@angular/core';
import { Project } from '../Project';
import { SdkService } from '../sdk.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from '../../shared/services/config/config.service';

@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html',
	styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
	project: Project;
	// packaging related variables
	skipValidation = false;
	pkgOutput = 'Packaging not yet started.';
	pkgPath = '';
	pkgSuccess = false;

	constructor(public config: ConfigService, private sdkService: SdkService, private http: HttpClient) { }

	ngOnInit() {
		this.project = this.sdkService.project;
	}

	// check if proper project is loaded or just the default UUID is selected
	projectLoaded(): boolean {
		return this.project.uuid !== 'defaultUuid';
	}

	package(): void {
		const endpoint = this.config.baseSDK + '/api/v1/projects/' + this.project.uuid + '/package';
		const header = new HttpHeaders()
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.set('Access-Control-Allow-Origin', this.config.baseSDK);

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
					this.pkgOutput = 'Packaging successful';
					this.pkgPath = response['package_path'];
					this.pkgSuccess = true;
				} else {
					this.pkgOutput = response['error_msg'];
				}
			});
	}

	// on-board the package to the currently configured service platform
	onboardPackage(): void {
		const endpoint = this.config.baseSP + this.config.packages;
		const pkgPath = this.config.baseSDK + '/api/v1/' + this.pkgPath;
		this.pkgOutput = 'On-boarding...';

		// get package from endpoint
		this.http.get(pkgPath, { responseType: 'blob' }).subscribe(pkg => {
			// set package in form data
			const formData = new FormData();
			formData.append('package', pkg);

			// upload package; need to disable CORS in browser!
			this.http.post(endpoint, formData).subscribe(response => {
				console.log(response);
				if  (response['error_msg'] == null) {
					this.pkgOutput = 'On-boarding request successful. Status: ' + response['status'];
					// TODO: check status periodically to see if on-boarding succeeds?
				} else {
					this.pkgOutput = response['error_msg'];
				}
			});
		});
	}
}
