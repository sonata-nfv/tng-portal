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

	constructor(private sdkService: SdkService, private sanitizer: DomSanitizer,
				private http: HttpClient) { }

	ngOnInit() {
		this.sdkService.currentFileUrls.subscribe(files => {
			this.fileUrls = files;
			// this.fileUrls = files.map(file => this.sanitizer.bypassSecurityTrustResourceUrl(file));
			this.loadFileContents();
		});
	}

	loadFileContents(): void {
		this.fileContents = { };
		for (const url of this.fileUrls) {
			console.log(url);
			this.http.get(url, { responseType: 'text'}).subscribe(
				(content: string) => this.fileContents[url] = content
			);
		}
	}

}
