import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
	displayedColumns = [ 'name', 'version', 'status', 'updatedAt' ];
	policy = {
		'enforced': false, 'policy': {
			'policy_uuid': 'uuid',
			'policy_name': 'name',
			'policy_vendor': 'vendor',
			'policy_version': 'version',
			'sla_name': 'slaName'
		}
	};

	// Detail in row and animations
	dataSourceVNF = new CustomDataSource();
	dataSourceCNF = new CustomDataSource();
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
	async requestNsInstance(uuid) {
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

	async requestPolicy(uuid) {
		// TODO request policy data and fill this.policy with it
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
		return (!this.dataSourceCNF.data || !this.dataSourceCNF.data.length) && !this.loading;
	}

	canShowNoResultsVNF() {
		return (!this.dataSourceVNF.data || !this.dataSourceVNF.data.length) && !this.loading;
	}

	canShowPolicyData() {
		// TODO check if this check is valid with received data
		return !this.loading && this.policy && this.policy.policy;
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	changePolicyActivation(value) {
		// TODO request activation or deactivation
		console.log('TCL: NsInstanceDetailComponent -> changePolicyActivation -> event', value);
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
