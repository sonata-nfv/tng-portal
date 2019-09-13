import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

import { SliceInstanceCreateComponent } from '../slice-instance-create/slice-instance-create.component';

@Component({
	selector: 'app-sm-slice-template-detail',
	templateUrl: './sm-slice-template-detail.component.html',
	styleUrls: [ './sm-slice-template-detail.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SmSliceTemplateDetailComponent implements OnInit {
	loading: boolean;
	detail = { };
	displayedColumns = [ 'uuid', 'serviceName', 'serviceVendor', 'serviceVersion', 'isShared', 'slaName' ];
	displayedColumnsLinks = [ 'networkName', 'mngmtNetwork', 'type' ];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private utilsService: UtilsService,
		private instantiateDialog: MatDialog
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.requestSliceTemplate(params[ 'id' ]);
		});
	}

	/**
     * Generates the HTTP request of a Slices Template by UUID.
     *
     * @param uuid ID of the selected template to be displayed.
     *             Comming from the route.
     */
	async requestSliceTemplate(uuid) {
		this.loading = true;
		const response = await this.commonService.getOneSliceTemplate(uuid);

		this.loading = false;
		if (response) {
			this.detail = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the template.', '');
			this.close();
		}
	}

	instantiate() {
		this.instantiateDialog.open(SliceInstanceCreateComponent, {
			data: {
				nstId: this.detail[ 'uuid' ],
				vendor: this.detail[ 'vendor' ],
				name: this.detail[ 'name' ],
				version: this.detail[ 'version' ]
			}
		});
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	openRow(row) {
		this.router.navigate([ `service-management/network-services/services/${ row.nsdRef }` ]);
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
