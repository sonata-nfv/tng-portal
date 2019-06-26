import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-runtime-policies-generated-actions',
	templateUrl: './runtime-policies-generated-actions.component.html',
	styleUrls: [ './runtime-policies-generated-actions.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesGeneratedActionsComponent implements OnInit {
	loading: boolean;
	generatedActions = new Array();
	displayedColumns = [ 'vnfName', 'scalingType', 'serviceInstanceUUID', 'value', 'date' ];

	constructor(
		private utilsService: UtilsService,
		private servicePlatformService: ServicePlatformService
	) { }

	ngOnInit() {
		this.requestGeneratedActions();
	}

	searchFieldData(search) {
		this.requestGeneratedActions(search);
	}

	/**
     * Generates the HTTP request to get the list of Generated Actions.
     *
     * @param search [Optional] Generated actions attributes that
     *                          must be matched by the returned
     *                          list of actions.
     */
	async requestGeneratedActions(search?) {
		this.loading = true;
		const actions = await this.servicePlatformService.getGeneratedActions(search);

		this.loading = false;
		if (actions) {
			this.generatedActions = actions;
		} else {
			this.utilsService.openSnackBar('Unable to fetch the generated actions', '');
		}
	}
}
