import { Component, OnInit } from '@angular/core';
import { Project } from '../Project';
import { SdkService } from '../sdk.service';

@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html',
	styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
	// TODO: move this to a new environment in the environments folder and use angular configuration instead
	baseip = 'http://192.168.99.100';
	project: Project;

	constructor(private sdkService: SdkService) { }

	ngOnInit() {
		this.project = this.sdkService.project;
	}

	// check if proper project is loaded or just the default UUID is selected
	projectLoaded(): boolean {
		return this.project.uuid !== 'defaultUuid';
	}
}
