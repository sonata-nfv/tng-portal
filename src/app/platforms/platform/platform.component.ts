import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { PlatformsService } from '../platforms.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-platform',
	templateUrl: './platform.component.html',
	styleUrls: [ './platform.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class PlatformComponent implements OnInit {
	loading: boolean;
	edition: boolean;
	disabledButton = true;
	originalPlatform: Object;
	updatedPlatform: Object;
	platformForm: FormGroup;
	osmForm: FormGroup;
	platformTypes = [ 'Sonata', 'OSM', 'ONAP' ];
	platformType: string;

	constructor(
		private platformsService: PlatformsService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.edition = uuid ? true : false;
			this.initForms();
			this.subscribeFormChanges();
			if (this.edition) {
				this.requestPlatform(uuid);
			}
		});
	}

	private initForms() {
		this.platformForm = new FormGroup({
			name: new FormControl({ value: '', disabled: this.edition }, Validators.required),
			host: new FormControl('', Validators.required),
			username: new FormControl('', Validators.required),
			password: new FormControl('', Validators.required),
			monitoring_urls: new FormControl()
		});

		this.osmForm = new FormGroup({
			project_name: new FormControl('', Validators.required),
			vim_account: new FormControl('', Validators.required)
		});
	}

	private subscribeFormChanges() {
		this.platformForm.valueChanges.subscribe(value => this.onFormChanges(value));
		this.osmForm.valueChanges.subscribe(value => this.onFormChanges(value));
	}

	private populateForm() {
		this.platformForm.get('name').setValue(this.originalPlatform[ 'name' ]);
		this.platformForm.get('host').setValue(this.originalPlatform[ 'host' ]);
		this.platformForm.get('username').setValue(this.originalPlatform[ 'username' ]);
		this.platformForm.get('password').setValue(this.originalPlatform[ 'password' ]);
		this.platformForm.get('monitoring_urls').setValue(this.originalPlatform[ 'monitoring_urls' ]);
		this.osmForm.get('project_name').setValue(this.originalPlatform[ 'project_name' ]);
		this.osmForm.get('vim_account').setValue(this.originalPlatform[ 'vim_account' ]);
	}

	private async requestPlatform(uuid) {
		this.loading = true;
		const response = await this.platformsService.getOnePlatform(uuid);

		this.loading = false;
		if (response) {
			this.originalPlatform = Object.assign({ }, response);
			this.platformType = this.parsePlatformType(this.originalPlatform[ 'type' ]);
			this.populateForm();
		} else {
			this.close();
		}
	}

	private parsePlatformType(type) {
		switch (type) {
			case 'sonata':
				return 'Sonata';
			case 'osm':
				return 'OSM';
			case 'onap':
				return 'ONAP';
			default:
				this.utilsService.openSnackBar('Unrecognized platform type. Please select another.', '');
				this.close();
		}
	}

	private onFormChanges(values?) {
		if (this.platformType === 'OSM') {
			this.disabledButton = this.edition ?
				this.platformForm.valid && this.osmForm.valid && this.canUpdatePlatform() ? false : true :
				this.platformForm.valid && this.osmForm.valid ? false : true;
		} else {
			this.disabledButton = this.edition ?
				this.platformForm.valid && this.canUpdatePlatform() ? false : true :
				this.platformForm.valid ? false : true;
		}
	}

	private createPlatformObject() {
		const platform = {
			name: this.platformForm.get('name').value,
			type: this.platformType.toLowerCase(),
			host: this.platformForm.get('host').value,
			username: this.platformForm.get('username').value,
			password: this.platformForm.get('password').value,
			monitoring_urls: this.platformForm.get('monitoring_urls').value || '',
		};
		if (this.osmForm.get('project_name').value) {
			platform[ 'project_name' ] = this.osmForm.get('project_name').value;
			platform[ 'vim_account' ] = this.osmForm.get('vim_account').value;
		}
		if (this.edition && this.originalPlatform[ 'service_token' ]) {
			platform[ 'service_token' ] = this.originalPlatform[ 'service_token' ];
		}

		return platform;
	}

	canUpdatePlatform() {
		this.updatedPlatform = this.createPlatformObject();
		return this.originalPlatform && this.updatedPlatform ?
			!(this.utilsService.compareObjects(this.originalPlatform, this.updatedPlatform)) : false;
	}

	canShowForm() {
		if (this.edition && this.originalPlatform) {
			return true;
		} else if (!this.edition) {
			return true;
		} else {
			return false;
		}
	}

	canShowPlatformForm() {
		return this.canShowForm() && this.platformType;
	}

	canShowOsmForm() {
		return this.canShowForm() && this.platformType === 'OSM' ? true : false;
	}

	receiveType(type) {
		this.platformType = type;
	}

	async createPlatform() {
		this.loading = true;
		const platform = this.createPlatformObject();
		const response = await this.platformsService.postPlatform(platform);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Platform ' + platform[ 'name' ] + ' created', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('There was an error in the platform creation', '');
		}
	}

	async updatePlatform() {
		this.loading = true;
		const platform = this.utilsService.getObjectDifferences(this.originalPlatform, this.updatedPlatform);
		const response = await this.platformsService.patchPlatform(this.originalPlatform[ 'name' ], platform);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Platform ' + this.originalPlatform[ 'name' ] + ' updated', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('There was an error in the platform edition', '');
		}
	}

	async deletePlatform() {
		this.loading = true;
		const response = await this.platformsService.deletePlatform(this.originalPlatform[ 'name' ]);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Platform deleted', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('There was an error deleting the platform', '');
		}
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}

}
