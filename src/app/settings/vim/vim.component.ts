import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { InputErrorStateMatcher } from '../../shared/classes/input-error-state-matcher';

import { SettingsService } from '../settings.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';

@Component({
	selector: 'app-vim',
	templateUrl: './vim.component.html',
	styleUrls: [ './vim.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VimComponent implements OnInit {
	loading: boolean;
	edition: boolean;
	editingConfig = false;
	originalVim: Object;
	updatedVim: Object;
	vimForm: FormGroup;
	openstackForm: FormGroup;
	kubernetesForm: FormGroup;
	matcher: InputErrorStateMatcher;
	yamlErrorMsg: String;
	vimTypes = [ 'Openstack', 'Kubernetes' ];
	vimType: string;
	disabledButton = true;

	constructor(
		private settingsService: SettingsService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute,
		private dialogData: DialogDataService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.edition = uuid ? true : false;
			if (this.edition) {
				this.requestVim(uuid);
			}
			this.initForms();
			this.subscribeFormChanges();
		});
	}

	private initForms() {
		this.matcher = new InputErrorStateMatcher();

		this.vimForm = new FormGroup({
			uuid: new FormControl({ value: '', disabled: true }),
			name: new FormControl('', Validators.required),
			city: new FormControl(''),
			country: new FormControl(''),
			endpoint: new FormControl('', [
				Validators.required,
				Validators.pattern(this.utilsService.getIpPattern())
			])
		});
		this.openstackForm = new FormGroup({
			username: new FormControl('', Validators.required),
			password: new FormControl('', Validators.required),
			tenant: new FormControl('', Validators.required),
			domain: new FormControl(),
			networkEndpoint: new FormControl('', Validators.pattern(this.utilsService.getIpPattern())),
			privateNetwork: new FormControl('', [
				Validators.required,
				Validators.pattern(this.utilsService.getIpPattern())
			]),
			privateNetworkMask: new FormControl('', [ Validators.required, Validators.pattern(this.utilsService.getMaskPattern()) ]),
			externalNetworkID: new FormControl('', Validators.required),
			externalRouterID: new FormControl('', Validators.required),
			externalRouterIP: new FormControl('', Validators.pattern(this.utilsService.getIpPattern())),
			managementFlowIP: new FormControl('', Validators.pattern(this.utilsService.getIpPattern())),
			floatingIpRanging: new FormControl('', Validators.pattern(this.utilsService.getIpRangePattern())),
		});
		this.kubernetesForm = new FormGroup({
			config: new FormControl('', Validators.required)
		});
	}

	private subscribeFormChanges() {
		this.vimForm.valueChanges.subscribe(value =>
			this.onFormChanges(value)
		);
		this.kubernetesForm.valueChanges.subscribe(value =>
			this.onFormChanges(value)
		);
		this.openstackForm.valueChanges.subscribe(value =>
			this.onFormChanges(value)
		);
	}

	/**
    * Generates the HTTP request of a VIM by UUID.
    *
    * @param uuid ID of the selected VIM to be displayed.
    *             Comming from the route.
    */
	private async requestVim(uuid) {
		this.loading = true;
		const response = await this.settingsService.getOneVim(uuid);

		this.loading = false;
		if (response) {
			this.originalVim = Object.assign({ }, response);
			this.originalVim[ 'type' ] = this.parseVimType(this.originalVim[ 'type' ]);
			this.vimType = this.originalVim[ 'type' ];
			// Convert to string to operate with it and enable objects comparation
			if (this.originalVim[ 'config' ]) {
				this.originalVim[ 'config' ] = JSON.stringify(this.originalVim[ 'config' ]);
			}
			this.populateForm();
		} else {
			this.utilsService.openSnackBar('Unable to fetch the VIM.', '');
			this.close();
		}
	}

	private populateForm() {
		this.vimForm.get('uuid').setValue(this.originalVim[ 'uuid' ]);
		this.vimForm.get('name').setValue(this.originalVim[ 'name' ]);
		this.vimForm.get('city').setValue(this.originalVim[ 'city' ]);
		this.vimForm.get('country').setValue(this.originalVim[ 'country' ]);
		this.vimForm.get('endpoint').setValue(this.originalVim[ 'endpoint' ]);
		if (this.vimType === 'Openstack') {
			this.openstackForm.get('username').setValue(this.originalVim[ 'username' ]);
			this.openstackForm.get('password').setValue(this.originalVim[ 'password' ]);
			this.openstackForm.get('tenant').setValue(this.originalVim[ 'tenant' ]);
			this.openstackForm.get('domain').setValue(this.originalVim[ 'domain' ]);
			this.openstackForm.get('networkEndpoint').setValue(this.originalVim[ 'network_endpoint' ]);
			this.openstackForm.get('privateNetwork').setValue(this.originalVim[ 'private_network_prefix' ]);
			this.openstackForm.get('privateNetworkMask').setValue(this.originalVim[ 'private_network_length' ]);
			this.openstackForm.get('externalNetworkID').setValue(this.originalVim[ 'external_network_id' ]);
			this.openstackForm.get('externalRouterID').setValue(this.originalVim[ 'external_router_id' ]);
			this.openstackForm.get('externalRouterIP').setValue(this.originalVim[ 'external_router_ip' ]);
			this.openstackForm.get('managementFlowIP').setValue(this.originalVim[ 'management_flow_ip' ]);
			this.openstackForm.get('floatingIpRanging').setValue(this.originalVim[ 'floating_ip_ranging' ]);
		} else {
			this.kubernetesForm.get('config').setValue(this.originalVim[ 'config' ]);
		}
	}

	private parseVimType(type) {
		switch (type) {
			case 'k8s':
				return 'Kubernetes';
			case 'heat':
				return 'Openstack';
			case 'mock':
				return 'Mock';
			default:
				this.utilsService.openSnackBar('Unrecognized VIM type. Please select another.', '');
				this.close();
		}
	}

	receiveType(type) {
		this.vimType = type;
		this.onFormChanges();
	}

	private onFormChanges(values?) {
		switch (this.vimType) {
			case 'Openstack':
				this.disabledButton = this.edition ?
					this.vimForm.valid && this.openstackForm.valid && this.canUpdateVim() ? false : true :
					this.vimForm.valid && this.openstackForm.valid ? false : true;
				break;
			case 'Kubernetes':
				this.disabledButton = this.edition ?
					(this.kubernetesForm.valid && this.vimForm.valid) && this.checkJSONValidity() && this.canUpdateVim() ? false : true :
					(this.kubernetesForm.valid && this.vimForm.valid) && this.checkJSONValidity() ? false : true;
				this.yamlErrorMsg = null;
				break;
			default:
				this.disabledButton = false;
				break;
		}
	}

	canUpdateVim() {
		if (this.isMockType()) {
			return false;
		} else {
			this.updatedVim = this.createVimObject();
			return this.originalVim && this.updatedVim ?
				!(this.utilsService.compareObjects(this.originalVim, this.updatedVim)) : false;
		}
	}

	private createVimObject() {
		const vim = {
			name: this.vimForm.get('name').value,
			city: this.vimForm.get('city').value,
			country: this.vimForm.get('country').value,
			endpoint: this.vimForm.get('endpoint').value,
			// Network endpoint is received in the case it's k8s too because k8s is connect to mock network
			network_endpoint: this.openstackForm.get('networkEndpoint').value
		};

		if (this.vimType === 'Openstack') {
			vim[ 'username' ] = this.openstackForm.get('username').value;
			vim[ 'password' ] = this.openstackForm.get('password').value;
			vim[ 'tenant' ] = this.openstackForm.get('tenant').value;
			vim[ 'domain' ] = this.openstackForm.get('domain').value;
			vim[ 'private_network_prefix' ] = this.openstackForm.get('privateNetwork').value;
			vim[ 'private_network_length' ] = this.openstackForm.get('privateNetworkMask').value;
			vim[ 'external_network_id' ] = this.openstackForm.get('externalNetworkID').value;
			vim[ 'external_router_id' ] = this.openstackForm.get('externalRouterID').value;
			vim[ 'external_router_ip' ] = this.openstackForm.get('externalRouterIP').value;
			vim[ 'management_flow_ip' ] = this.openstackForm.get('managementFlowIP').value;
			vim[ 'floating_ip_ranging' ] = this.openstackForm.get('floatingIpRanging').value;

		} else {
			vim[ 'config' ] = this.kubernetesForm.get('config').value;
		}

		if (this.edition) {
			vim[ 'uuid' ] = this.originalVim[ 'uuid' ];
			vim[ 'type' ] = this.originalVim[ 'type' ];
		}

		return vim;
	}

	convertYamlToJson() {
		const input = this.kubernetesForm.get('config').value;
		const parsedFromYaml = this.utilsService.yamlToJSON(input);

		parsedFromYaml && this.utilsService.isValidJSON(parsedFromYaml) ?
			this.kubernetesForm.get('config').setValue(parsedFromYaml)
			: this.yamlErrorMsg = '*This is not a valid YAML';
	}

	checkJSONValidity() {
		const input = this.kubernetesForm.get('config').value;
		return this.utilsService.isValidJSON(input);
	}

	canShowForm() {
		if (this.edition && this.originalVim) {
			return true;
		} else if (!this.edition) {
			return true;
		} else {
			return false;
		}
	}

	canShowMockEndpoint() {
		return (this.vimType && this.canShowForm()
			&& !(this.vimType.trim().toLowerCase() === 'mock' && !this.originalVim[ 'country' ])) ? true : false;
	}

	canShowMockCity() {
		return !(this.vimType.trim().toLowerCase() === 'mock' && !this.originalVim[ 'city' ]);
	}

	canShowMockCountry() {
		return !(this.vimType.trim().toLowerCase() === 'mock' && !this.originalVim[ 'country' ]);
	}

	canShowOpenstackForm() {
		return this.vimType === 'Openstack' && this.canShowForm();
	}

	canShowKubernetesForm() {
		return this.vimType === 'Kubernetes' && this.canShowForm();
	}

	canShowConfigMenu() {
		return this.edition && !this.loading
			&& (this.vimType.toLocaleLowerCase() === 'openstack'
				|| this.vimType.toLocaleLowerCase() === 'kubernetes');
	}

	canShowError() {
		return this.kubernetesForm.valid && !this.checkJSONValidity() && !this.yamlErrorMsg;
	}

	isMockType() {
		return this.vimType && this.vimType.trim().toLowerCase() === 'mock';
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	copyJSONToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	getParsedJSON(value) {
		return JSON.parse(value);
	}

	async createVim() {
		this.loading = true;
		const vim = this.createVimObject();
		// Configuration sent must be a JSON
		if (vim[ 'config' ]) {
			vim[ 'config' ] = this.getParsedJSON(vim[ 'config' ]);
		}
		const response = await this.settingsService.postVim(this.vimType, vim);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('VIM ' + response[ 'name' ] + ' created', '');

			response[ 'uuid' ] ?
				this.router.navigate([ `settings/vim/${ response[ 'uuid' ] }` ])
				: this.close();
		} else {
			this.utilsService.openSnackBar('There was an error in the VIM creation', '');
		}
	}

	async updateVim() {
		this.loading = true;
		const vim = this.utilsService.getObjectDifferences(this.originalVim, this.updatedVim);
		// Configuration sent must be a JSON
		if (vim[ 'config' ]) {
			vim[ 'config' ] = this.getParsedJSON(vim[ 'config' ]);
		}
		const response = await this.settingsService.patchVim(this.vimType, this.originalVim[ 'uuid' ], vim);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('VIM ' + response[ 'name' ] + ' updated', '');

			response[ 'uuid' ] ?
				this.requestVim(response[ 'uuid' ])
				: this.close();
		} else {
			this.utilsService.openSnackBar('There was an error in the VIM update', '');
		}
	}

	async deleteVim() {
		this.loading = true;
		const response = await this.settingsService.deleteVim(this.originalVim[ 'uuid' ]);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('VIM deleted', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('There was an error deleting the VIM', '');
		}
	}

	openTip() {
		const title = 'Tip!';
		const content = 'Here you have an example of a floating IP range: \n\n \
						10.0.0.1 - 10.0.0.68, 10.0.0.80 - 10.0.0.100\n\n\n \
						You can add as many ranges as you want but remember that the ranges must be separated by commas!';
		const action = 'Accept';

		this.dialogData.openDialog(title, content, action, async () => { });
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
