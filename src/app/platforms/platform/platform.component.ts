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
		this.initForms();
		this.subscribeFormChanges();

		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.edition = uuid ? true : false;
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
			project_name: new FormControl('', Validators.required)
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
	}

	private async requestPlatform(uuid) {
		this.loading = true;
		const response = await this.platformsService.getOnePlatform(uuid);

		this.loading = false;
		if (response) {
			this.originalPlatform = Object.assign({}, response);
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

	canUpdatePlatform() {
		// TODO compare original and new platforms
		return false;
	}

	private createPlatformObject() {
		// TODO prepare platform object to be sent
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

	createPlatform() { }

	updatePlatform() {

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
