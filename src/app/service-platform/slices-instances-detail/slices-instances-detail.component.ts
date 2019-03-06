import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServicePlatformService } from '../service-platform.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-slices-instances-detail',
	templateUrl: './slices-instances-detail.component.html',
	styleUrls: [ './slices-instances-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SlicesInstancesDetailComponent implements OnInit {
	loading: boolean;
	uuid: string;
	detail = {};

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private servicePlatformService: ServicePlatformService,
		private dialogData: DialogDataService,
		private utilsService: UtilsService
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.uuid = params[ 'id' ];
			this.requestSliceInstance(params[ 'id' ]);
		});
	}

	/**
     * Generates the HTTP request of a Slices instance by UUID.
     *
     * @param uuid ID of the selected instance to be displayed.
     *             Comming from the route.
     */
	requestSliceInstance(uuid) {
		this.loading = true;

		this.servicePlatformService
			.getOneSliceInstance(uuid)
			.then(response => {
				this.loading = false;
				this.detail = response;
			})
			.catch(err => {
				this.loading = false;
				this.utilsService.openSnackBar(err, '');
				this.close();
			});
	}

	stopInstance() {
		const title = 'Are you sure...?';
		const content = 'Are you sure you want to terminate this instance?';
		const action = 'Terminate';

		this.dialogData.openDialog(title, content, action, () => {
			this.utilsService.openSnackBar('Terminating instance...', '');

			this.servicePlatformService
				.postOneSliceInstanceTermination(this.detail[ 'uuid' ])
				.then(response => {
					// this.utilsService.openSnackBar(response, '');
					// this.requestSliceInstance(this.uuid);
				})
				.catch(err => {
					this.utilsService.openSnackBar(err, '');
				});
		});
	}

	close() {
		this.router.navigate([ 'service-platform/slices/slices-instances' ]);
	}
}
