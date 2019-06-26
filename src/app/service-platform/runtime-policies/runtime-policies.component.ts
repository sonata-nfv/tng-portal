import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';
import { SelectorListContext } from '@angular/compiler';

@Component({
	selector: 'app-runtime-policies',
	templateUrl: './runtime-policies.component.html',
	styleUrls: [ './runtime-policies.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesComponent implements OnInit, OnDestroy {
	@ViewChild('selectNS') selectNS;
	loading: boolean;
	policies = new Array();
	nsList = new Array();
	displayedColumns = [ 'vendor', 'name', 'version', 'ns', 'sla', 'default', 'delete' ];
	subscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private commonService: CommonService,
		private servicePlatformService: ServicePlatformService
	) { }

	ngOnInit() {
		this.requestRuntimePolicies();

		// Reloads the template list every when children are closed
		this.subscription = this.router.events.subscribe(event => {
			if (
				event instanceof NavigationEnd &&
				event.url === '/service-platform/policies/runtime-policies' &&
				this.route.url[ 'value' ].length === 3 &&
				this.route.url[ 'value' ][ 2 ].path === 'runtime-policies'
			) {
				this.requestRuntimePolicies();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	searchFieldData(search) {
		this.requestRuntimePolicies(search);
	}

	filterNS(nsUUID) {
		nsUUID === 'None' ?
			this.requestRuntimePolicies()
			: this.requestRuntimePolicies('ns_uuid=' + nsUUID);
	}

	reload() {
		this.selectNS.reset = true;
		this.requestRuntimePolicies();
	}

	/**
     * Generates the HTTP request to get the list of Runtime Policies.
     *
     * @param search [Optional] Runtime Policy attributes that
     *                          must be matched by the returned
     *                          list of policies.
     */
	async requestRuntimePolicies(search?) {
		this.loading = true;

		const ns = await this.commonService.getNetworkServices('SP');
		const runtimePolicies = await this.servicePlatformService.getRuntimePolicies(search);

		this.loading = false;
		if (ns) {
			this.nsList = ns;
			this.nsList.unshift({ uuid: 'None', name: 'None' });
		} else {
			this.utilsService.openSnackBar('Unable to fetch any network service', '');
		}

		runtimePolicies ?
			this.sortPolicies(runtimePolicies)
			: this.utilsService.openSnackBar('Unable to fetch any runtime policy', '');

	}

	private sortPolicies(runtimePolicies) {
		this.policies = runtimePolicies.sort((a, b) => {
			const keyA = a.default;
			const keyB = b.default;

			if (keyA > keyB) {
				return -1;
			}
			if (keyA < keyB) {
				return 1;
			} else {
				return 0;
			}
		});
	}

	async setDefaultPolicy(uuid) {
		this.loading = true;
		const policy = this.policies.find(x => x.uuid === uuid);
		const response = await this.servicePlatformService.setDefaultRuntimePolicy(policy.uuid, !policy.default, policy.ns_uuid);

		this.loading = false;
		if (response) {
			this.requestRuntimePolicies();
			this.utilsService.openSnackBar('The runtime policy you selected was successfully updated', '');
		} else {
			this.utilsService.openSnackBar('Unable to set this policy as the default one', '');
		}
	}

	async deletePolicy(policy) {
		this.loading = true;
		const response = await this.servicePlatformService.deleteOneRuntimePolicy(policy.uuid);

		this.loading = false;
		if (response) {
			this.requestRuntimePolicies();
			this.utilsService.openSnackBar('The runtime policy was successfully deleted', '');
		} else {
			this.utilsService.openSnackBar('Unable to delete this runtime policy', '');
		}
	}

	openPolicy(policy) {
		this.router.navigate([ policy.uuid ], { relativeTo: this.route });
	}

	createNew() {
		this.router.navigate([ 'new' ], { relativeTo: this.route });
	}
}
