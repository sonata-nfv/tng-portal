import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { SdkService } from '../sdk.service';
import { ConfigService } from '../../shared/services/config/config.service';
import { Project } from '../Project';

@Component({
	selector: 'app-descriptor-generator',
	templateUrl: './descriptor-generator.component.html',
	styleUrls: ['./descriptor-generator.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DescriptorGeneratorComponent implements OnInit {

	disabledButton = true;
	section = 'sdk';
	project = new Project();

	constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private sdkService: SdkService,
				private config: ConfigService) { }

	ngOnInit() {
	}

	createService() {
		const endpoint = this.config.baseSDK + ':5098/api/v1/projects';

		// only generate Tango descriptors as the SP doesn't accept packages with Tango and OSM
		const body = new HttpParams().set('only_tango', 'true')
			.set('name', this.project.name)
			.set('author', this.project.author)
			.set('vendor', this.project.vendor)
			.set('description', this.project.description)
			.set('vnfs', String(this.project.numVnfs));

		this.http.post(endpoint,
			body.toString(),
			{
				headers: new HttpHeaders()
					.set('Content-Type', 'application/x-www-form-urlencoded')
					.set('Access-Control-Allow-Origin', this.config.baseSDK + ':5098')
			}
		).subscribe(response => {
			this.sdkService.newProject(this.project.name, this.project.author, this.project.vendor, this.project.description,
				this.project.numVnfs, response['uuid'], response['files']);
			this.router.navigate(['sdk/descriptor-displayer']);
		});
	}

	close() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}
}
