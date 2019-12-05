import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import {
	animate,
	state,
	style,
	transition,
	trigger
} from '@angular/animations';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

import { CustomDataSource } from '../../shared/components/custom-data-source.component';

@Component({
	selector: 'app-runtime-policy-detail',
	templateUrl: './runtime-policy-detail.component.html',
	styleUrls: [ './runtime-policy-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None,
	animations: [
		trigger('detailExpand', [
			state(
				'collapsed',
				style({
					display: 'none',
					transform: 'rotateX(90deg)'
				})
			),
			state('expanded', style({ })),
			transition('collapsed => expanded', animate('300ms ease-in'))
		])
	]
})
export class RuntimePolicyDetailComponent implements OnInit {
	loading = false;
	policyForm: FormGroup;
	slaList = new Array();
	detail = { };
	slaValue: string;
	displayedRuleColumns = [ 'name', 'salience', 'inertia', 'delete' ];
	policyRuleDetail = { };
	dataSourcePolicyRule: CustomDataSource;

	isExpansionDetailRow = (i: number, row: Object) =>
		row.hasOwnProperty('detailRow')

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
			this.policyForm.get('default').setValue(this.detail[ 'default' ]);

			this.dataSourcePolicyRule = new CustomDataSource();
			this.dataSourcePolicyRule.data = this.detail[ 'policyRules' ];

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

				this.slaValue = this.policyForm.get('sla').value[ 'uuid' ];
			}
		} else {
			this.slaList.unshift({ uuid: 'None', name: 'None' });
		}
	}

	receiveSLA(sla) {
		const actualSLA = this.policyForm.get('sla').value ?
			this.policyForm.get('sla').value : { uuid: 'None', name: 'None' };

		if (sla !== 'None' && actualSLA[ 'uuid' ] !== sla) {
			this.bindSLA(sla);
		} else if (actualSLA[ 'uuid' ] !== sla) {
			this.bindSLA(null);
		}
	}

	async setDefaultPolicy(value) {
		this.loading = true;
		const response = await this.servicePlatformService.setDefaultRuntimePolicy(this.detail[ 'uuid' ], value, this.detail[ 'nsUUID' ]);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('The runtime policy you selected was successfully updated', '');
		} else {
			this.utilsService.openSnackBar('Unable to set this policy as the default one', '');
		}
	}

	async bindSLA(slaUUID) {
		this.loading = true;
		const data = { slaid: slaUUID, nsid: this.detail[ 'nsUUID' ] };

		const response = await this.servicePlatformService.bindRuntimePolicy(this.detail[ 'uuid' ], data);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar('SLA binded successfully', '');
		} else {
			this.utilsService.openSnackBar('Unable to bind the SLA to this policy', '');
		}
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	openService() {
		this.router.navigate([ `service-platform/network-services/${ this.detail[ 'nsUUID' ] }` ]);
	}

	close() {
		this.router.navigate([ 'service-platform/policies/runtime-policies' ]);
	}
}
