import { Injectable } from '@angular/core';
import { Project } from './Project';


@Injectable()
export class SdkService {
	project: Project;

	constructor() {
		this.project = new Project(undefined, undefined, undefined, undefined, undefined, undefined, undefined);
	}

	newProject(name: string, author: string, vendor: string, description: string, numVnfs: number, uuid: string, fileUrls: Array<string>) {
		this.project = new Project(name, author, vendor, description, numVnfs, uuid, fileUrls);
	}
}
