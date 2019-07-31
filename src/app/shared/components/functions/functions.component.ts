import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UtilsService } from '../../services/common/utils.service';
import { CommonService } from '../../services/common/common.service';

@Component({
	selector: 'app-functions',
	templateUrl: './functions.component.html',
	styleUrls: [ './functions.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class FunctionsComponent implements OnInit {
	loading: boolean;
	section: string;
	functions: Array<Object>;
	displayedColumns = [ 'Vendor', 'Name', 'Version', 'Status' ];

	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.section = this.route.url[ 'value' ][ 0 ].path
			.replace(/-/g, ' ')
			.toUpperCase();
		this.requestFunctions();
	}

	searchFieldData(search) {
		this.requestFunctions(search);
	}

	/**
     * Generates the HTTP request to get the list of functions.
     *
     * @param search [Optional] Function attributes that must be
     *                          matched by the returned list of
     *                          functions.
     */
	async requestFunctions(search?) {
		this.loading = true;
		const response = await this.commonService.getFunctions(this.section, search);

		this.loading = false;
		if (response) {
			this.functions = response;
		} else {
			this.utilsService.openSnackBar('Unable to fetch any function', '');
		}
	}

	openFunction(row) {
		if (this.section === 'SERVICE PLATFORM') {
			this.router.navigate([ row.uuid ], { relativeTo: this.route });
		}
	}
}
