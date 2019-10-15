import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
	animate,
	state,
	style,
	transition,
	trigger
} from '@angular/animations';

import { ServiceManagementService } from '../service-management.service';
import { CustomDataSource } from './custom-data-source.component';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-ns-instance-detail',
	templateUrl: './ns-instance-detail.component.html',
	styleUrls: [ './ns-instance-detail.component.scss' ],
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
export class NsInstanceDetailComponent implements OnInit {
	loading = false;
	detail = { };
	instanceUUID: string;
	displayedColumns = [ 'name', 'version', 'status', 'updatedAt', 'scaleIn' ];
	policy = { };
	dataSourceVNF: CustomDataSource;
	dataSourceCNF: CustomDataSource;

	recordDetail = { };
	isExpansionDetailRow = (i: number, row: Object) =>
		row.hasOwnProperty('detailRow')

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private dialogData: DialogDataService,
		private utilsService: UtilsService,
		private serviceManagementService: ServiceManagementService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.requestNsInstance(uuid);
			this.requestPolicy(uuid);
		});
	}

	/**
     * Generates the HTTP request of a NS Instance by UUID.
     *
     * @param uuid ID of the selected instance to be displayed.
     *             Comming from the route.
     */
	private async requestNsInstance(uuid) {
		this.loading = true;
		const response = await this.serviceManagementService.getOneNSInstance(uuid);

		if (response) {
			this.detail = response;
			this.instanceUUID = this.detail[ 'uuid' ];
			if (this.detail[ 'vnf' ]) {
				const responses = await Promise.all(
					this.detail[ 'vnf' ].map(item =>
						this.serviceManagementService.getOneFunctionRecord(item.vnfr_id)
					)
				);

				this.loading = false;
				if (responses) {
					this.dataSourceVNF = new CustomDataSource();
					this.dataSourceCNF = new CustomDataSource();
					this.dataSourceVNF.data = responses.filter(instance => instance[ 'vdus' ]);
					this.dataSourceCNF.data = responses.filter(instance => instance[ 'cdus' ]);
				} else {
					this.utilsService.openSnackBar('Unable to fetch the VNF instance', '');
				}
			}
		} else {
			this.utilsService.openSnackBar('Unable to fetch the network service instance', '');
			this.close();
		}
	}

	private async requestPolicy(uuid) {
		this.loading = true;
		const policy = await this.serviceManagementService.getInstancePolicyData(uuid);

		this.loading = false;
		policy ?
			this.policy = policy
			: this.utilsService.openSnackBar('Unable to fetch the policy data of the instance', '');
	}

	terminate() {
		const title = 'Are you sure...?';
		const content = 'Are you sure you want to terminate this instance?';
		const action = 'Terminate';

		this.dialogData.openDialog(title, content, action, async () => {
			this.loading = true;
			const response = await this.serviceManagementService.postOneNSInstanceTermination(this.detail[ 'uuid' ]);

			this.loading = false;
			if (response) {
				const name = response[ 'name' ] ? response[ 'name' ] : '';
				this.utilsService.openSnackBar('Terminating ' + name + ' instance...', '');
			} else {
				this.utilsService.openSnackBar('There was an error terminating the instance', '');
			}
		});
	}

	canShowTerminate() {
		return this.detail[ 'uuid' ] && this.detail[ 'status' ].toUpperCase() !== 'TERMINATED';
	}

	canShowNoResultsCNF() {
		return (!this.dataSourceCNF || !this.dataSourceCNF.data || !this.dataSourceCNF.data.length);
	}

	canShowNoResultsVNF() {
		return (!this.dataSourceVNF || !this.dataSourceVNF.data || !this.dataSourceVNF.data.length);
	}

	canShowPolicyData() {
		return Object.keys(this.policy).length && Object.keys(this.policy[ 'policy' ]).length;
	}

	canShowScaleOutVNF() {
		return this.dataSourceVNF && this.dataSourceVNF.data && this.dataSourceVNF.data.length;
	}

	canShowScaleOutCNF() {
		return this.dataSourceCNF && this.dataSourceCNF.data && this.dataSourceCNF.data.length;
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	async changePolicyActivation(activation) {
		this.loading = true;
		const policyUUID = this.policy[ 'policy' ][ 'policy_uuid' ];
		const response = activation ?
			await this.serviceManagementService.getRuntimePolicyActivation('activate', this.detail[ 'uuid' ], policyUUID)
			: await this.serviceManagementService.getRuntimePolicyActivation('deactivate', this.detail[ 'uuid' ], policyUUID);

		this.loading = false;
		if (response) {
			activation ?
				this.utilsService.openSnackBar('Runtime policy activated', '')
				: this.utilsService.openSnackBar('Runtime policy deactivated', '');
		} else {
			activation ?
				this.utilsService.openSnackBar('There was an error activating the runtime policy', '')
				: this.utilsService.openSnackBar('There was an error deactivating the runtime policy', '');

		}

		this.requestPolicy(this.detail[ 'uuid' ]);
	}

	private canScale() {
		const canScale = Object.keys(this.policy).length && !this.policy[ 'enforced' ];
		const isPolicyActive = Object.keys(this.policy).length && this.policy[ 'enforced' ];

		if (isPolicyActive) {
			const title = 'Oh oh...?';
			const content = 'You can not scale while there is an active policy applied to this instance';
			const action = 'Deactivate';

			this.dialogData.openDialog(title, content, action, async () => {
				this.changePolicyActivation(false);
			});
		}

		return canScale;
	}

	scaleIn(instance) {
		const scaleIn = {
			'instance_uuid': instance.uuid,
			'request_type': 'SCALE_SERVICE',
			'scaling_type': 'REMOVE_VNF',
			'vnfd_uuid': instance.descriptorRef
		};

		if (this.canScale()) {
			this.sendScaleRequest(scaleIn);
		}
	}

	scaleOut(scaleOut) {
		if (this.canScale()) {
			this.sendScaleRequest(scaleOut);
		}
	}

	async sendScaleRequest(requestBody) {
		// TODO check if it is scale in and the last instance if response
		// is different and another msg should be sent
		this.loading = true;
		const response = await this.serviceManagementService.postScaleAction(requestBody);

		this.loading = false;
		response ?
			this.utilsService.openSnackBar('Instance successfully scaled', '')
			: this.utilsService.openSnackBar('There was an error scaling the instance', '');
	}

	openService() {
		this.router.navigate([ `service-management/network-services/services/${ this.detail[ 'serviceID' ] }` ]);
	}

	openPolicy() {
		this.router.navigate([ `service-platform/policies/runtime-policies/${ this.policy[ 'policy' ][ 'policy_uuid' ] }` ]);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
