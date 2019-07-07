import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SdkService } from '../sdk.service';

@Component({
	selector: 'app-descriptor-displayer',
	templateUrl: './descriptor-displayer.component.html',
	styleUrls: ['./descriptor-displayer.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DescriptorDisplayerComponent implements OnInit {

	files = [];

	constructor(private service: SdkService, private sanitizer: DomSanitizer) {
	}

	ngOnInit() {
		this.service.files.subscribe(files => {
			this.files = files.map(file => this.sanitizer.bypassSecurityTrustResourceUrl(file));
			// this.files = files.map(file => this.sanitizer.bypassSecurityTrustUrl(file));
		});
	}

}
