import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { NsInstantiateDialogComponent } from '../ns-instantiate-dialog/ns-instantiate-dialog.component';

import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';
import { ServiceManagementService } from '../service-management.service';

@Component({
	selector: 'app-sm-network-services-detail',
	templateUrl: './sm-network-services-detail.component.html',
	styleUrls: [ './sm-network-services-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SmNetworkServicesDetailComponent implements OnInit {
	loading: boolean;
	detail = { };
	slas: Array<object>;
	displayedColumnsVNF = [ 'id', 'vendor', 'name', 'version' ];
	displayedColumnsSLA = [ 'vendor', 'name', 'version', 'flavor', 'allowedInstances', 'licenseType' ];

	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService,
		private router: Router,
		private route: ActivatedRoute,
		private instantiateDialog: MatDialog,
		private serviceManagementService: ServiceManagementService,
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.requestNS(uuid);
			this.requestSLAs(uuid);
		});
	}

	async requestNS(uuid) {
		this.loading = true;
		const response = await this.commonService.getOneNetworkService('sm', uuid);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the network service', '');
			this.close();
		}
	}

	async requestSLAs(uuid) {
		this.loading = true;
		const slas = await this.serviceManagementService.getSlasForService(uuid);

		this.loading = false;
		slas ?
			this.slas = slas
			: this.utilsService.openSnackBar('Unable to fetch any SLA for this network service', '');
	}

	instantiate() {
		this.instantiateDialog.open(NsInstantiateDialogComponent, {
			data: {
				serviceUUID: this.detail[ 'uuid' ],
				name: this.detail[ 'name' ]
			}
		});
	}

	canShowInstantiate() {
		return this.detail[ 'uuid' ] && this.detail[ 'name' ];
	}

	canShowVNFs() {
		return (!this.detail[ 'vnf' ] || !this.detail[ 'vnf' ].length) && !this.loading;
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	openSLA(uuid) {
		this.router.navigate([ 'service-platform/slas/sla-templates/', uuid ]);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
