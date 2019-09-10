import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-vim-config',
	templateUrl: './vim-config.component.html',
	styleUrls: [ './vim-config.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VimConfigComponent implements OnInit {
	@Input() vimName: string;
	@Input() vimType: string;
	canShowForm: false;
	vimConfigForm: FormGroup;
	targets = new Array<string>();

	constructor(private utilsService: UtilsService) { }

	ngOnInit() {
		// TODO check if there is any previous config and modify accordingly canShowForm
		const path = this.vimType.toLowerCase() === 'openstack' ?
			'/metrics' : '/federate';

		this.vimConfigForm = new FormGroup({
			jobName: new FormControl({ value: this.vimName, disabled: true }, Validators.required),
			metricsPath: new FormControl(path, Validators.required),
			target: new FormControl(null, Validators.pattern(this.utilsService.getIpAndPortPattern())),
		});
	}

	addTarget() {
		// TODO error when enter
		const target = this.vimConfigForm.get('target').value;

		if (target && !(this.targets.includes(target))) {
			this.targets.push(target);
			this.vimConfigForm.get('target').setValue(null);
		}
	}

	eraseEntry(entry) {
		this.targets = this.targets.filter(target => target !== entry);
	}

	canShowAddTarget() {
		return this.vimConfigForm.get('target').value && !this.patternErrorExists() && !this.repeatedErrorExists();
	}

	patternErrorExists() {
		return this.vimConfigForm.get('target').hasError('pattern');
	}

	repeatedErrorExists() {
		const target = this.vimConfigForm.get('target').value;

		if (target && this.targets.includes(target) && !this.patternErrorExists()) {
			this.vimConfigForm.get('target').setErrors({ 'incorrect': true });
			return true;
		}

		return false;
	}

	// TODO create vim config object and send it

}
