import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-vnv-network-services-detail',
	templateUrl: './vnv-network-services-detail.component.html',
	styleUrls: [ './vnv-network-services-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class VnvNetworkServicesDetailComponent implements OnInit {
	loading: boolean;
	detail = {};
	displayedColumns = [ 'id', 'name', 'vendor', 'version' ];

	constructor(
		private commonService: CommonService,
		private utilsService: UtilsService,
		private router: Router,
		private route: ActivatedRoute,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			const uuid = params[ 'id' ];
			this.requestNetworkService(uuid);
		});
	}

	requestNetworkService(uuid) {
		this.loading = true;

		this.commonService
			.getOneNetworkService('vnv', uuid)
			.then(response => {
				this.loading = false;
				this.detail = response;

				if (this.detail[ 'vnf' ].lenght < 1) {
					this.detail[ 'vnf' ] = [];
				}
			})
			.catch(err => {
				this.loading = false;
				this.utilsService.openSnackBar(err, '');
				this.close();
			});
	}

	execute() {
		this.verificationAndValidationPlatformService
			.postOneTest('service', this.detail[ 'uuid' ])
			.then(response => {
				this.utilsService.openSnackBar('Success!', '');
			})
			.catch(err => {
				this.utilsService.openSnackBar(err, '');
			});
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
