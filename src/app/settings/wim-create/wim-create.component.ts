import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { SettingsService } from '../settings.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-wim-create',
	templateUrl: './wim-create.component.html',
	styleUrls: [ './wim-create.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class WimCreateComponent implements OnInit {
	loading: boolean;
	wimForm: FormGroup;
	disabledButton = true;
	vims = [];
	vimsIncluded = [];
	wimTypes = [ 'Tapi' ];
	wimType: string;

	constructor(
		private settingsService: SettingsService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.requestVims();

		this.wimForm = new FormGroup({
			name: new FormControl('', Validators.required),
			endpoint: new FormControl('', Validators.required),
			username: new FormControl(),
			password: new FormControl(),
			authKey: new FormControl(),
		});

		this.wimForm.valueChanges.subscribe(value =>
			this.onFormChanges(value)
		);
	}

	receiveType(type) {
		this.wimType = type;
	}

	/**
     * Generates the HTTP request to get the list of VIMs.
     *
     */
	private requestVims() {
		this.loading = true;
		this.settingsService.getVims()
			.then(response => {
				if (response) {
					this.loading = false;
					this.vims = response.map(vim => vim.name + ': ' + vim.uuid);
				} else {
					this.loading = false;
					this.utilsService.openSnackBar('There was an error fetching the VIMs. It will not be possible to create a WIM.', '');
				}
			});
	}

	receiveWim(vim) {
		this.vimsIncluded.push(vim);
		this.vims = this.vims.filter(x => x !== vim);
		this.onFormChanges();
	}

	eraseEntry(index) {
		this.vims.push(this.vimsIncluded[ index ]);
		this.vimsIncluded.splice(index, 1);
		this.onFormChanges();
	}

	private onFormChanges(values?) {
		this.disabledButton =
			this.wimForm.valid && this.vimsIncluded.length ? false : true;
	}

	private _getWimData() {
		return {
			name: this.wimForm.get('name').value,
			endpoint: this.wimForm.get('endpoint').value,
			username: this.wimForm.get('username').value,
			password: this.wimForm.get('password').value,
			authkey: this.wimForm.get('authKey').value,
			vim_list: this.vimsIncluded.map(vim => vim.split(': ')[ 1 ])
		};
	}

	createWim() {
		this.loading = true;
		const wim = this._getWimData();
		this.settingsService
			.postWim(wim)
			.then(message => {
				if (!message || message !== `WIM ${wim[ 'name' ]} created`) {
					throw new Error(message);
				}
				this.loading = false;
				this.utilsService.openSnackBar(message, '');
				this.close();
			})
			.catch((msg) => {
				this.loading = false;
				msg ?
					this.utilsService.openSnackBar(msg, '') :
					this.utilsService.openSnackBar('There was an error in the WIM creation', '');
			});
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
