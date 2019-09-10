import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UtilsService } from '../../shared/services/common/utils.service';
import { SettingsService } from '../settings.service';

@Component({
	selector: 'app-vim-config',
	templateUrl: './vim-config.component.html',
	styleUrls: [ './vim-config.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VimConfigComponent implements OnInit {
	@Input() vimName: string;
	@Input() vimType: string;
	loading: boolean;
	canShowForm = false;
	vimConfigForm: FormGroup;
	targets = new Array<string>();
	vimConfig: object;

	constructor(
		private utilsService: UtilsService,
		private settingsService: SettingsService
	) { }

	ngOnInit() {
		this.initForm();
		this.getVimConfig();
	}

	initForm() {
		const path = this.vimType.toLowerCase() === 'openstack' ?
			'/metrics' : '/federate';

		this.vimConfigForm = new FormGroup({
			jobName: new FormControl({ value: this.vimName, disabled: true }, Validators.required),
			metricsPath: new FormControl(path, Validators.required),
			target: new FormControl(null, Validators.pattern(this.utilsService.getIpAndPortPattern())),
		});
	}

	private async getVimConfig() {
		this.loading = true;
		const response = await this.settingsService.getVimsConfig();

		this.loading = false;
		(response && response[ 'targets' ]) ?
			this.vimConfig = response[ 'targets' ]
				.find(item => item.job_name.toLowerCase() === this.vimName.toLowerCase())
			: this.utilsService.openSnackBar('Unable to fetch the VIMs configuration data', '');

		if (this.vimConfig) {
			this.populateForm();
			this.canShowForm = true;
		} else {
			this.canShowForm = false;
		}
	}

	private populateForm() {
		this.vimConfigForm.get('jobName').setValue(this.vimConfig[ 'job_name' ]);
		this.vimConfigForm.get('metricsPath').setValue(this.vimConfig[ 'metrics_path' ]);
		this.vimConfig[ 'static_configs' ].forEach(config =>
			(this.targets = this.targets.concat(config.targets))
		);
	}

	addTarget() {
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
