import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { ControlsValidatorDirective } from '../../shared/utils/controls-validator';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { SdkService } from '../sdk.service';

@Component({
	selector: 'app-descriptor-generator',
	templateUrl: './descriptor-generator.component.html',
	styleUrls: ['./descriptor-generator.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DescriptorGeneratorComponent implements OnInit {

	serviceForm: FormGroup;
	disabledButton = true;
	isEmpty = true;
	section = 'sdk';

	constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private sdkService: SdkService) { }

	ngOnInit() {
		this.initForm();
	}

	initForm() {
		this.serviceForm = new FormGroup({
			name: new FormControl('', [Validators.required]),
			author: new FormControl(''),
			vendor: new FormControl(''),
			description: new FormControl(''),
			numberOfVNFs: new FormControl('', [Validators.required])
		});
		this.serviceForm.valueChanges.subscribe(() => this.onFormChanges());
	}

	private onFormChanges() {
		this.disabledButton = !this.serviceForm.valid;
		this.isEmpty = !this.serviceForm.dirty;
	}

	createService() {
		// TODO: move this to a new environment in the environments folder and use angular configuration instead
		// const baseip = 'http://localhost';
		const baseip = 'http://192.168.99.100';
		const endpoint = baseip + ':5098/api/v1/projects';

		const body = new HttpParams()
			.set('name', this.serviceForm.get('name').value)
			.set('author', this.serviceForm.get('author').value)
			.set('vendor', this.serviceForm.get('vendor').value)
			.set('description', this.serviceForm.get('description').value)
			.set('vnfs', this.serviceForm.get('numberOfVNFs').value);

		this.http.post(endpoint,
			body.toString(),
			{
				headers: new HttpHeaders()
					.set('Content-Type', 'application/x-www-form-urlencoded')
					.set('Access-Control-Allow-Origin', baseip + ':5098')
			}
		).subscribe(response => {
			console.log('UUID of generated project:', response['uuid']);
			this.sdkService.updateProjectUuid(response['uuid']);
			// this.sdkService.updateFiles(response['files']);
			this.router.navigate(['sdk/descriptor-displayer']);
		});
	}

	close() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}
}
