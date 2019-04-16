import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

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
	nsListSelect = new Array();
	storedGuarantees = new Array();
	guaranteesListSelect = new Array();
	guaranties = new Array();
	nss = new Array();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
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
			name: new FormControl(),
			ns: new FormControl(),
			expirationDate: new FormControl()
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
			(this.templateForm.get('ns').value && this.templateForm.get('name').value &&
				this.templateForm.get('expirationDate').value && this.storedGuarantees.length) ?
				false : true;
	}

	receiveNS(ns) {
		this.templateForm.get('ns').setValue(ns);
	}

	receiveDate(expirationDate) {
		this.templateForm.get('expirationDate').setValue(expirationDate);
	}

	addGuarantee(guarantee) {
		if (guarantee) {
			const id = guarantee.split(' - ')[ 0 ];
			const prop = guarantee.split(' - ')[ 1 ].split(': ')[ 0 ];

			// Include the selected guarantee in the displayed list
			this.storedGuarantees.push(Object.assign({}, this.guaranties.find(x => x.uuid === id), { closed: true }));

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

	generateTemplate() {
		const guarantees = this.storedGuarantees.map(x => x.uuid);
		const nsd_uuid = this.nss.find(x => x.name === this.templateForm.get('ns').value).serviceId;
		const expireDate = this.templateForm.get('expirationDate').value;

		return {
			nsd_uuid,
			templateName: this.templateForm.get('name').value,
			expireDate,
			// provider_name: ,
			// service_licence_type
			// allowed_service_instances
			// service_licence_expiration_date
			// dflavour_name
			guaranteeId: guarantees
		};
	}

	createSlaTemplate() {
		this.loading = true;
		const template = this.generateTemplate();
		console.log(template)


		// this.servicePlatformService
		// 	.postOneSLATemplate(template)
		// 	.then(response => {
		// 		this.loading = false;
		// 		this.utilsService.openSnackBar('Template successfully created!', '');
		// 		this.close();
		// 	})
		// 	.catch(err => {
		// 		this.loading = false;
		// 		const title = 'oh oh...';
		// 		const action = 'Accept';

		// 		if (err.error[ 'ERROR: ' ] === 'Conflict') {
		// 			const content = 'This template name is already taken!';
		// 			this.dialogData.openDialog(title, content, action, () => { });
		// 		} else if (err.error[ 'ERROR: ' ] === 'The expire date is not a future date.') {
		// 			const content = 'The expire date is not a future date. Please choose another.';
		// 			this.dialogData.openDialog(title, content, action, () => { });
		// 		} else {
		// 			this.utilsService.openSnackBar('There was an error in the template creation', '');
		// 		}
		// 	});
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
