import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';

import { ExecuteTestDialogComponent } from '../execute-test-dialog/execute-test-dialog.component';

@Component({
	selector: 'app-vnv-network-services-detail',
	templateUrl: './vnv-network-services-detail.component.html',
	styleUrls: [ './vnv-network-services-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VnvNetworkServicesDetailComponent implements OnInit {
	loading: boolean;
	detail = { };
	displayedColumns = [ 'id', 'name', 'vendor', 'version' ];

	constructor(
		private commonService: CommonService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute,
		private executeTestDialog: MatDialog,
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.requestNetworkService(uuid);
		});
	}

	async requestNetworkService(uuid) {
		this.loading = true;
		const response = await this.commonService.getOneNetworkService('vnv', uuid);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the network service', '');
			this.close();
		}
	}

	execute() {
		this.executeTestDialog.open(ExecuteTestDialogComponent, {
			data: { section: 'ns', uuid: this.detail[ 'uuid' ], name: this.detail[ 'name' ], policiesEnabled: true }
		});
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
