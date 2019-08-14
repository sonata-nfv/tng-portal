import { Component, OnInit } from '@angular/core';
import { Project } from '../project';
import { SdkService } from '../sdk.service';

@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html',
	styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
	project: Project;

	constructor(private sdkService: SdkService) { }

	ngOnInit() {
		this.project = this.sdkService.project;
	}

}
