import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-runtime-policy-detail',
	templateUrl: './runtime-policy-detail.component.html',
	styleUrls: [ './runtime-policy-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class RuntimePolicyDetailComponent implements OnInit {
	loading = false;
	closed = true;
	policyForm: FormGroup;
	slaList = new Array();
	detail = { };
	monitoringRules = 'This is a monitoring rule for this example!';

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private servicePlatformService: ServicePlatformService,
		private utilsService: UtilsService,
		private commonService: CommonService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.requestRuntimePolicy(uuid);
		});

		this.policyForm = new FormGroup({
			default: new FormControl(),
			sla: new FormControl()
		});
	}

	/**
     * Generates the HTTP request of a Runtime Policy by UUID.
     *
     * @param uuid ID of the selected runtime policy to be displayed.
     *             Comming from the route.
     */
	async requestRuntimePolicy(uuid) {
		this.loading = true;
		const runtimePolicy = await this.servicePlatformService.getOneRuntimePolicy(uuid);

		if (runtimePolicy) {
			this.detail = runtimePolicy;
			this.populateForm();

			// Request SLAs related to this NS
			this.requestSLAs(this.detail[ 'nsUUID' ]);
		} else {
			this.utilsService.openSnackBar('Unable to fetch the runtime policy data', '');
			this.close();
		}
	}

	async requestSLAs(nsUUID) {
		this.loading = true;
		const slas = await this.commonService.getSLATemplates();

		this.loading = false;
		if (slas) {
			this.slaList = slas.filter(x => x.nsUUID === nsUUID);
			this.slaList.unshift({ uuid: 'None', name: 'None' });

			// Set as a value the actual SLA chosen
			if (this.detail[ 'slaUUID' ]) {
				let sla = this.slaList.find(item => item.uuid === this.detail[ 'slaUUID' ]);

				if (sla) {
					this.policyForm.get('sla').setValue(sla);
				} else {
					sla = { uuid: this.detail[ 'slaUUID' ], name: this.detail[ 'sla' ] };
					this.slaList.push(sla);
					this.policyForm.get('sla').setValue(sla);
				}
			}
		} else {
			this.slaList.unshift({ uuid: 'None', name: 'None' });
		}
	}

	private populateForm() {
		this.policyForm.get('default').setValue(this.detail[ 'default' ]);
		this.policyForm.get('sla').setValue(this.detail[ 'sla' ] ?
			this.detail[ 'sla' ] : { uuid: 'None', name: 'None' });
	}

	receiveSLA(sla) {
		const actualSLA = this.policyForm.get('sla').value;

		if (sla !== 'None' && actualSLA[ 'uuid' ] !== sla[ 'uuid' ]) {
			this.bindSLA(sla[ 'uuid' ]);
		} else if (actualSLA[ 'uuid' ] !== sla[ 'uuid' ]) {
			this.bindSLA(null);
		}
	}

	async setDefaultPolicy(value) {
		this.loading = true;
		const response = await this.servicePlatformService.setDefaultRuntimePolicy(this.detail[ 'uuid' ], value, this.detail[ 'nsUUID' ]);

		this.loading = false;
		if (response) {
			this.policyForm.get('default').setValue(value);
			this.utilsService.openSnackBar('The runtime policy you selected was successfully updated', '');
		} else {
			this.utilsService.openSnackBar('Unable to set this policy as the default one', '');
		}
	}

	async bindSLA(slaUUID) {
		this.loading = true;
		const response = await this.servicePlatformService.bindRuntimePolicy(this.detail[ 'uuid' ], slaUUID, this.detail[ 'nsUUID' ]);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('SLA binded successfully', '');
		} else {
			this.utilsService.openSnackBar('Unable to bind the SLA to this policy', '');
		}
	}

	close() {
		this.router.navigate([ 'service-platform/policies/runtime-policies' ]);
	}
}
