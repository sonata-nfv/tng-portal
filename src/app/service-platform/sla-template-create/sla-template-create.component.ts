import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';

@Component({
	selector: 'app-sla-template-create',
	templateUrl: './sla-template-create.component.html',
	styleUrls: [ './sla-template-create.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SlaTemplateCreateComponent implements OnInit {
	loading: boolean;
	closed = false;
	disabledButton = true;
	templateForm: FormGroup;
	nsList: Array<any>;
	guaranteesList: Array<any>;
	guaranteesListOriginal: Array<any>;
	storedGuarantees = new Array();
	flavors: Array<any>;
	licenses = [ 'public', 'trial', 'private' ];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private dialogData: DialogDataService,
		private utilsService: UtilsService,
		private commonService: CommonService,
		private servicePlatformService: ServicePlatformService,
	) { }

	ngOnInit() {
		this.initForms();
		this.requestData();
	}

	initForms() {
		this.templateForm = new FormGroup({
			name: new FormControl('', Validators.required),
			ns: new FormControl('', Validators.required),
			providerName: new FormControl(),
			expirationDate: new FormControl('', Validators.required),
			license: new FormControl(),
			instances: new FormControl('', Validators.pattern(this.utilsService.getNumberPattern())),
			licenseExpirationDate: new FormControl(),
			flavor: new FormControl()
		});

		this.templateForm.valueChanges.subscribe(value => this._onFormChanges(value));
	}

	private _onFormChanges(value?) {
		this.disabledButton = this.templateForm.valid ? false : true;
	}

	async requestData() {
		this.loading = true;
		const response = await this.commonService.getNetworkServices('SP');

		this.loading = false;
		if (response) {
			// Check there are NS to create a template
			if (!response.length) {
				this.openError();
			}

			this.nsList = response;
		} else {
			this.openError();
		}
	}

	async requestGuarantees(nsUUID) {
		this.loading = true;
		const nsName = this.nsList.find(x => x.uuid === nsUUID).name;
		const response = await this.servicePlatformService.getServiceGuarantees(nsName);

		this.loading = false;
		if (response && response.length) {
			if (!response.length) {
				this.utilsService.openSnackBar('There are no network service guarantees related.', '');
			}

			this.guaranteesList = Array.from(response);
			this.guaranteesListOriginal = response;
		} else {
			this.utilsService.openSnackBar('There was an error fetching the network service guarantees related.', '');
		}
	}

	async requestFlavors(nsUUID) {
		this.loading = true;
		const response = await this.servicePlatformService.getFlavors(nsUUID);

		this.loading = false;
		if (response && response.length) {
			this.flavors = response;
		} else {
			this.utilsService.openSnackBar('No flavors were found for this network service', '');
		}
	}

	receiveNS(ns) {
		if (ns) {
			this.templateForm.get('ns').setValue(ns);
			this.requestGuarantees(ns);
			this.requestFlavors(ns);
		}
	}

	receiveFlavor(flavor) {
		this.templateForm.get('flavor').setValue(flavor);
	}

	receiveExpirationDate(expirationDate) {
		this.templateForm.get('expirationDate').setValue(expirationDate);
	}

	receiveLicense(license) {
		this.templateForm.get('license').setValue(license);
	}

	receiveLicenseExpirationDate(expirationDate) {
		this.templateForm.get('licenseExpirationDate').setValue(expirationDate);
	}

	receiveGuarantee(guaranteeUUID) {
		if (guaranteeUUID) {
			const guarantee = this.guaranteesList.find(item => item.uuid === guaranteeUUID);

			// Include the selected guarantee in the displayed list
			this.storedGuarantees.push(Object.assign({ }, guarantee, { closed: true }));

			// Remove the selected guarantee from the guarantees list offered
			this.guaranteesList = this.guaranteesList.filter(item => item.uuid !== guaranteeUUID);

			// Remove other guarantees with same goals
			this.guaranteesList = this.guaranteesList.filter(item => item.guaranteeName !== guarantee.guaranteeName);

			this._onFormChanges();
		}
	}

	eraseEntry(item) {
		// Remove item from the list of stored guarantees displayed
		this.storedGuarantees = this.storedGuarantees.filter(x => x.uuid !== item.uuid);

		// Save all items with that property in the offered guarantees
		this.guaranteesList = this.guaranteesList.concat(this.guaranteesListOriginal.filter(x => x.guaranteeName === item.guaranteeName));

		this._onFormChanges();
	}

	generateTemplate() {
		return {
			nsd_uuid: this.templateForm.get('ns').value,
			templateName: this.templateForm.get('name').value,
			provider_name: this.templateForm.get('providerName').value || '',
			expireDate: this.templateForm.get('expirationDate').value,
			guaranteeId: this.storedGuarantees.map(x => x.uuid),
			service_licence_type: this.templateForm.get('license').value || 'public',
			allowed_service_instances: this.templateForm.get('instances').value.toString() || '1',
			service_licence_expiration_date: this.templateForm.get('licenseExpirationDate').value || '',
			dflavour_name: this.templateForm.get('flavor').value || ''
		};
	}

	async createSlaTemplate() {
		this.loading = true;
		const template = this.generateTemplate();
		const response = await this.servicePlatformService.postOneSLATemplate(template);

		this.loading = false;
		if (response && response instanceof Object) {
			this.utilsService.openSnackBar('Template created', '');
			this.close();
		} else if (response) {
			const title = 'oh oh...';
			const action = 'Accept';
			const content = 'Some of the data introduced is not valid. Please, use the following hint to fix it: \n \n' + response;
			this.dialogData.openDialog(title, content, action, () => { });
		} else {
			this.utilsService.openSnackBar('There was an error creating the template', '');
		}
	}

	canShowAdvancedSection() {
		return this.templateForm.get('ns').value;
	}

	canShowGuarantees() {
		return !this.closed && (this.guaranteesList || this.storedGuarantees.length);
	}

	canShowFlavors() {
		return !this.closed && this.flavors && this.flavors.length;
	}

	instancesErrorExists() {
		return this.templateForm.get('instances').hasError('pattern');
	}

	changeCloseStatus() {
		this.closed = !this.closed;
		this.templateForm.get('licenseExpirationDate').setValue(null);
		return;
	}

	openError() {
		const title = 'oh oh...';
		const content = 'There was an error fetching the network services required. Please, try again later.';
		const action = 'Accept';

		this.dialogData.openDialog(title, content, action, () => {
			this.close();
		});
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
