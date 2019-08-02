import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SdkService } from '../sdk.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-descriptor-displayer',
	templateUrl: './descriptor-displayer.component.html',
	styleUrls: ['./descriptor-displayer.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DescriptorDisplayerComponent implements OnInit {

	fileUrls = [];
	fileContents = { };
	fileNames = { };

	constructor(private sdkService: SdkService, private sanitizer: DomSanitizer,
				private http: HttpClient) { }

	ngOnInit() {
		this.sdkService.currentFileUrls.subscribe(files => {
			this.fileUrls = files;
			this.loadFileContents();
			this.getFileNames();
		});
	}

	loadFileContents(): void {
		this.fileContents = { };
		for (const url of this.fileUrls) {
			this.http.get(url, { responseType: 'text'}).subscribe(
				(content: string) => this.fileContents[url] = content
			);
		}
	}

	// based on the file URLs, retrieve the file names, ie, endings
	getFileNames(): void {
		this.fileNames = { };
		for (const url of this.fileUrls) {
			const startIdx = url.lastIndexOf('/') + 1;
			this.fileNames[url] = url.slice(startIdx);
		}
	}
}
