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
	nsListSelect: Array<any>;
	guaranteesListSelect: Array<any>;
	flavours: Array<any>;
	storedGuarantees = new Array();
	guaranties = new Array();
	nss = new Array();
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
			flavour: new FormControl()
		});

		this.templateForm.valueChanges.subscribe(value => this._onFormChanges(value));
	}

	async requestData() {
		this.loading = true;
		const responses = await Promise.all([
			this.commonService.getNetworkServices('SP'),
			this.servicePlatformService.getServiceGuarantees()
		]);

		this.loading = false;
		if (responses) {
			// Check there are NS and SLOs to create a template
			if (!responses[ 0 ].length || !responses[ 1 ].length) {
				this.utilsService.openSnackBar('There was an error fetching the information required', '');
				this.close();
			}

			// Save complete data from guarantees and NS
			this.nss = responses[ 0 ];
			this.guaranties = responses[ 1 ];

			// Save NS data to display in select
			this.nsListSelect = responses[ 0 ].map(x => x.name);
			// Create a list of guarantees to display in the select
			this.guaranteesListSelect = responses[ 1 ].map(x =>
				x.uuid + ' - ' + x.name + ': ' + x.threshold + ' ' + x.unit
			);
		} else {
			this.utilsService.openSnackBar('There was an error fetching the information required', '');
			this.close();
		}
	}

	private _onFormChanges(value?) {
		this.disabledButton =
			(this.templateForm.valid && this.storedGuarantees.length) ?
				false : true;
	}

	receiveNS(ns) {
		if (ns) {
			this.templateForm.get('ns').setValue(ns);
			this.requestFlavours(ns);
		}
	}

	async requestFlavours(ns) {
		this.loading = true;
		const nsd_uuid = this.nss.find(x => x.name === ns).serviceId;
		const response = await this.servicePlatformService.getFlavours(nsd_uuid);

		this.loading = false;
		if (response && response.length) {
			this.flavours = response;
		} else {
			this.utilsService.openSnackBar('No flavours were found for this network service', '');
		}
	}

	receiveExpirationDate(expirationDate) {
		this.templateForm.get('expirationDate').setValue(expirationDate);
	}

	addGuarantee(guarantee) {
		if (guarantee) {
			const id = guarantee.split(' - ')[ 0 ];
			const prop = guarantee.split(' - ')[ 1 ].split(': ')[ 0 ];

			// Include the selected guarantee in the displayed list
			this.storedGuarantees.push(Object.assign({ }, this.guaranties.find(x => x.uuid === id), { closed: true }));

			// Remove the selected guarantee from the guarantees list offered
			this.guaranteesListSelect = this.guaranteesListSelect.filter(x => x.split(' - ')[ 0 ] !== id);

			// Remove other guarantees with same goals
			this.guaranteesListSelect = this.guaranteesListSelect.filter(x => x.split(' - ')[ 1 ].split(': ')[ 0 ] !== prop);

			this._onFormChanges();
		}
	}

	eraseEntry(item) {
		// Remove item from the list of stored guarantees displayed
		this.storedGuarantees = this.storedGuarantees.filter(x => x.uuid !== item.uuid);

		// Save all items with that property in the offered guarantees
		this.guaranteesListSelect = this.guaranteesListSelect.concat(
			this.guaranties.filter(x => x.name === item.name).map(x => x.uuid + ' - ' + x.name + ': ' + x.threshold + ' ' + x.unit)
		);

		this._onFormChanges();
	}

	receiveLicense(license) {
		this.templateForm.get('license').setValue(license);
	}

	receiveLicenseExpirationDate(expirationDate) {
		this.templateForm.get('licenseExpirationDate').setValue(expirationDate);
	}

	generateTemplate() {
		const guarantees = this.storedGuarantees.map(x => x.uuid);
		const nsd_uuid = this.nss.find(x => x.name === this.templateForm.get('ns').value).serviceId;

		return {
			nsd_uuid,
			templateName: this.templateForm.get('name').value,
			provider_name: this.templateForm.get('providerName').value || '',
			expireDate: this.templateForm.get('expirationDate').value,
			guaranteeId: guarantees,
			service_licence_type: this.templateForm.get('license').value || 'public',
			allowed_service_instances: this.templateForm.get('instances').value || '1',
			service_licence_expiration_date: this.templateForm.get('licenseExpirationDate').value || '',
			dflavour_name: this.templateForm.get('flavour').value || ''
		};
	}

	async createSlaTemplate() {
		this.loading = true;
		const template = this.generateTemplate();
		const response = await this.servicePlatformService.postOneSLATemplate(template);

		this.loading = false;
		if (response && response instanceof Object) {
			this.utilsService.openSnackBar('Template ' + response[ 'name' ] + ' created', '');
			this.close();
		} else if (response && response instanceof String) {
			const title = 'oh oh...';
			const action = 'Accept';
			const content = 'Some of the data introduced is not valid. Please, use the following hint to fix it: \n \n' + response;
			this.dialogData.openDialog(title, content, action, () => { });
		} else {
			this.utilsService.openSnackBar('There was an error creating the template', '');
		}
	}

	canShowAdvancedSection() {
		return this.guaranteesListSelect || this.storedGuarantees.length;
	}
	instancesErrorExists() {
		return this.templateForm.get('instances').hasError('pattern');
	}

	canShowFlavours() {
		return !this.closed && this.flavours && this.flavours.length;
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
