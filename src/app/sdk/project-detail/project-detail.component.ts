import { Component, OnInit } from '@angular/core';
import { Project } from '../Project';
import { SdkService } from '../sdk.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html',
	styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
	// TODO: move this to a new environment in the environments folder and use angular configuration instead
	baseip = 'http://192.168.99.100';
	project: Project;
	// packaging related variables
	skipValidation = true;
	pkgOutput = 'Packaging output. Packaging not yet started.';
	pkgPath = '';
	pkgSuccess = false;

	constructor(private sdkService: SdkService, private http: HttpClient) { }

	ngOnInit() {
		this.project = this.sdkService.project;
	}

	// check if proper project is loaded or just the default UUID is selected
	projectLoaded(): boolean {
		return this.project.uuid !== 'defaultUuid';
	}

	package(): void {
		const endpoint = this.baseip + ':5098/api/v1/projects/' + this.project.uuid + '/package';
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
}
