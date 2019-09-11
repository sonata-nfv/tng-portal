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
	@Input() configID: string;
	@Input() vimType: string;
	loading: boolean;
	canShowForm = false;
	vimConfigForm: FormGroup;
	targets = new Array<string>();
	originalTargets: Array<string>;
	originalConfig: object;
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
		const path = this.vimType.toLowerCase() === 'openstack' ? '/metrics' : '/federate';

		this.vimConfigForm = new FormGroup({
			metricsPath: new FormControl(path, Validators.required),
			target: new FormControl(null, Validators.pattern(this.utilsService.getIpAndPortPattern())),
		});
	}

	private async getVimConfig() {
		this.loading = true;
		const response = await this.settingsService.getVimsConfig();

		this.loading = false;
		if (response && response[ 'targets' ]) {
			// Store original object to be sent when updating/creating the config
			this.originalConfig = response;
			// Store the existing config if any
			this.vimConfig = response[ 'targets' ]
				.find(item => item.job_name.toLowerCase() === this.configID.toLowerCase());
		} else {
			this.utilsService.openSnackBar('Unable to fetch the VIMs configuration data', '');
		}

		if (this.vimConfig) {
			this.populateForm();
			this.canShowForm = true;
		} else {
			this.canShowForm = false;
		}
	}

	private populateForm() {
		this.vimConfigForm.get('metricsPath').setValue(this.vimConfig[ 'metrics_path' ]);
		this.targets = new Array<string>();
		this.vimConfig[ 'static_configs' ].forEach(config =>
			(this.targets = this.targets.concat(config.targets))
		);

		this.originalTargets = [ ...this.targets ];
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

	canDisableSave() {
		const configHasChanged = (JSON.stringify(this.originalTargets) !== JSON.stringify(this.targets))
			|| (this.vimConfig[ 'metrics_path' ] !== this.vimConfigForm.get('metricsPath').value);

		return (!this.vimConfigForm.valid || !this.targets.length) || !configHasChanged;
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

	createConfig() {
		let config = new Object();
		let vimsConfig = new Object();

		if (this.vimType.toLowerCase() === 'openstack') {
			config = {
				'job_name': this.configID,
				'metrics_path': this.vimConfigForm.get('metricsPath').value,
				'scheme': 'http',
				'scrape_interval': '5s',
				'scrape_timeout': '5s',
				'static_configs': [
					{
						'targets': this.targets
					}
				]
			};
		} else if (this.vimType.toLowerCase() === 'kubernetes') {
			config = {
				'honor_labels': true,
				'job_name': this.configID,
				'metrics_path': this.vimConfigForm.get('metricsPath').value,
				'params': {
					'match[]': [
						'{job=\'kubernetes-apiservers\'}',
						'{job=\'kubernetes-cadvisor\'}',
						'{job=\'kubernetes-nodes\'}',
						'{job=\'kubernetes-pods\'}',
						'{job=\'kubernetes-service-endpoints\'}',
						'{job=\'pushgateway\'}'
					]
				},
				'scrape_interval': '10s',
				'scrape_timeout': '10s',
				'static_configs': [
					{
						'targets': this.targets
					}
				]
			};
		}

		if (this.originalConfig) {
			vimsConfig = Object.assign({ }, this.originalConfig);
			vimsConfig[ 'targets' ].push(config);
		} else {
			vimsConfig = {
				'targets': config
			};
		}

		return vimsConfig;
	}

	updateConfig() {
		const configUpdated = this.originalConfig[ 'targets' ]
			.find(item => item.job_name.toLowerCase() === this.configID.toLowerCase());
		configUpdated[ 'metrics_path' ] = this.vimConfigForm.get('metricsPath').value;
		configUpdated[ 'static_configs' ] = [ { 'targets': this.targets } ];

		return this.originalConfig;
	}

	async postVimConfig() {
		this.loading = true;
		const vimsConfig = this.vimConfig ? this.updateConfig() : this.createConfig();

		const response = await this.settingsService.postVimConfig(vimsConfig);
		response ?
			this.utilsService.openSnackBar('VIM configuration data successfully stored', '')
			: this.utilsService.openSnackBar('Unable to store this configuration', '');

		this.getVimConfig();
	}
}
