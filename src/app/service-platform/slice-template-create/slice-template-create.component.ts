import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';

@Component({
	selector: 'app-slice-template-create',
	templateUrl: './slice-template-create.component.html',
	styleUrls: [ './slice-template-create.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SliceTemplateCreateComponent implements OnInit {
	loading: boolean;
	disabledButton = true;
	templateForm: FormGroup;
	nsSelectList: Array<string>;
	nsListComplete = new Array();
	slaSelectList: Array<string>;
	slaListComplete = new Array();
	nsObj: Object;
	sliceServices = new Array();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private dialogData: DialogDataService,
		private commonService: CommonService,
		private servicePlatformService: ServicePlatformService
	) { }

	ngOnInit() {
		this.initForms();
		this.getData();
	}

	private initForms() {
		this.templateForm = new FormGroup({
			name: new FormControl('', [ Validators.required, this.noWhitespaceValidator ]),
			vendor: new FormControl('', [ Validators.required, this.noWhitespaceValidator ]),
			version: new FormControl('', [ Validators.required, this.noWhitespaceValidator ]),
			author: new FormControl('', [ Validators.required, this.noWhitespaceValidator ]),
			description: new FormControl('', [ Validators.required, this.noWhitespaceValidator ])
		});
		this.templateForm.valueChanges.subscribe(value => this.onFormChanges(value));
	}

	noWhitespaceValidator(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}

	private async getData() {
		this.loading = true;
		const response = await this.commonService.getNetworkServices('SP');

		if (response) {
			this.nsSelectList = response.map(x => x.vendor + ': ' + x.name + ' - v' + x.version);
			this.nsListComplete = response;
			const response2 = await this.commonService.getSLATemplates();

			this.loading = false;
			if (response2) {
				this.slaListComplete = response2;
			} else {
				this.utilsService.openSnackBar('Unable to fetch any SLA.', '');
			}
		} else {
			const title = 'oh oh...';
			const content = 'There was an error fetching the network services required to create a template. Please, try again later.';
			const action = 'Accept';

			this.dialogData.openDialog(title, content, action, () => {
				this.close();
			});
		}
	}

	private onFormChanges(values?) {
		this.disabledButton = this.templateForm.valid && this.sliceServices.length ? false : true;
	}

	receiveNS(ns) {
		if (ns) {
			this.nsObj = {
				vendor: ns.split(': ')[ 0 ],
				name: ns.split(': ')[ 1 ].split(' - v')[ 0 ],
				version: ns.split(': ')[ 1 ].split(' - v')[ 1 ]
			};
			// Get uuid of the selected service
			const result = this.nsListComplete.find(
				x =>
					x.vendor === this.nsObj[ 'vendor' ] &&
					x.name === this.nsObj[ 'name' ] &&
					x.version === this.nsObj[ 'version' ]
			);

			this.nsObj[ 'nsdID' ] = result.serviceId;
			this.nsObj[ 'servname' ] = result.name;

			// Filter the SLAs related to the NS selected
			this.slaSelectList = this.slaListComplete
				.filter(x => x.nsUUID === this.nsObj[ 'uuid' ])
				.map(x => x.name);

			if (!this.slaSelectList.length) {
				this.utilsService.openSnackBar('There are no SLAs for this network service.', '');
			}

			this.slaSelectList.unshift('None');
		}
	}

	receiveSLA(sla) {
		if (sla) {
			if (sla !== 'None') {
				const result = this.slaListComplete.find(x => x.name === sla);
				this.nsObj[ 'sla' ] = result.name;
				this.nsObj[ 'slaID' ] = result.uuid;
			} else {
				this.nsObj[ 'slaName' ] = 'None';
				this.nsObj[ 'slaID' ] = 'None';
			}

			this.sliceServices.push(Object.assign({ }, this.nsObj));
			this.onFormChanges();
			this.nsObj = null;
		}
	}

	eraseEntry(index) {
		this.sliceServices.splice(index, 1);
		this.onFormChanges();
	}

	private createTemplateObject() {
		return {
			name: this.templateForm.get('name').value,
			vendor: this.templateForm.get('vendor').value,
			version: this.templateForm.get('version').value,
			author: this.templateForm.get('author').value,
			description: this.templateForm.get('description').value,
			sliceServices: this.sliceServices
		};
	}

	async createSliceTemplate() {
		this.loading = true;
		const template = this.createTemplateObject();
		const response = await this.servicePlatformService.postOneSliceTemplate(template);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('Template ' + response[ 'nstd' ][ 'name' ] + ' created.', '');
			this.close();
		} else {
			this.utilsService.openSnackBar('There was an error in the template creation.', '');

		}
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
