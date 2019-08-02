import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';
import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';

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
		private dialogData: DialogDataService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
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
		const title = this.detail[ 'name' ];
		const content = 'Do you want to automatically execute the related tests? \
						Otherwise, the tests planned will require your manual \
						confirmation to be run. ';
		const action = 'Yes';
		const secondaryAction = 'No';

		this.dialogData.openDialog(title, content, action,
			() => this.createTestPlans(this.detail[ 'uuid' ], false),
			() => this.createTestPlans(this.detail[ 'uuid' ], true), secondaryAction);
	}

	async createTestPlans(uuid, confirmRequired) {
		this.loading = true;
		const response = await this.verificationAndValidationPlatformService.postTestPlans('ns', uuid, confirmRequired);

		this.loading = false;
		response ?
			this.router.navigate([ 'validation-and-verification/test-plans' ])
			: this.utilsService.openSnackBar('Unable to execute this test', '');
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
