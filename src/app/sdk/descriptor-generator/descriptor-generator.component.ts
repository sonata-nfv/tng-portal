import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlsValidator } from '../../shared/utils/controls-validator';

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

	constructor(private router: Router, private route: ActivatedRoute, private controlsValidator: ControlsValidator) { }

	ngOnInit() {
		this.initForm();
	}

	initForm() {
		this.serviceForm = new FormGroup({
			name: new FormControl('', [Validators.required, this.controlsValidator.noWhitespaceValidator]),
			author: new FormControl('', [Validators.required, this.controlsValidator.noWhitespaceValidator]),
			vendor: new FormControl('', [Validators.required, this.controlsValidator.noWhitespaceValidator]),
			description: new FormControl('', [Validators.required, this.controlsValidator.noWhitespaceValidator]),
			numberOfVNFs: new FormControl('', [Validators.required])
		});
		this.serviceForm.valueChanges.subscribe(value => this.onFormChanges(value));
	}

	private onFormChanges(values?) {
		this.disabledButton = !this.serviceForm.valid;
		this.isEmpty = !this.serviceForm.dirty;
	}

	createService() {
		console.log({
			name: this.serviceForm.get('name').value,
			author: this.serviceForm.get('author').value,
			vendor: this.serviceForm.get('vendor').value,
			description: this.serviceForm.get('description').value,
			numberOfVNFs: this.serviceForm.get('numberOfVNFs')
		});
	}

	close() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}

}
