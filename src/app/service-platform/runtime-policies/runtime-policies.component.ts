import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
	selector: 'app-runtime-policies',
	templateUrl: './runtime-policies.component.html',
	styleUrls: [ './runtime-policies.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesComponent implements OnInit, OnDestroy {
	loading: boolean;
	reset: boolean;
	policiesDisplayed = new Array();
	policies = new Array();
	nsList = new Array();
	nsListComplete = new Array();
	displayedColumns = [
		'vendor',
		'name',
		'version',
		'ns',
		'sla',
		'default',
		'delete'
	];
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

	/**
     * Generates the HTTP request to get the list of Runtime Policies.
     *
     * @param search [Optional] Runtime Policy attributes that
     *                          must be matched by the returned
     *                          list of policies.
     */
	async requestRuntimePolicies(search?) {
		this.loading = true;

		this.reset = true;
		setTimeout(() => {
			this.reset = false;
		}, 5);

		const responses = await Promise.all([
			this.commonService.getNetworkServices('SP'),
			this.servicePlatformService.getRuntimePolicies(search)
		]);

		this.loading = false;
		if (responses) {
			// Save NS data to display
			this.nsList = responses[ 0 ].map(
				x => x.vendor + ': ' + x.name + ' - v' + x.version
			);
			this.nsList.unshift('None');

			// Save complete data from NS and policies
			this.nsListComplete = responses[ 0 ];
			this.policies = responses[ 1 ];

			this.sortPolicies(this.policies);
		} else {
			this.utilsService.openSnackBar('Unable to fetch the services nor the policies', '');
		}
	}

	setDefaultPolicy(uuid) {
		this.loading = true;
		const policy = this.policies.find(x => x.uuid === uuid);

		this.servicePlatformService
			.setDefaultRuntimePolicy(policy.uuid, !policy.default, policy.ns_uuid)
			.then(response => {
				this.requestRuntimePolicies();

				// Set all the other policies of the ns to false
				this.policiesDisplayed
					.filter(x => x.ns_uuid === policy.ns_uuid && x.uuid !== uuid)
					.forEach(x => (x.default = false));

				// Set the default value of the selected policy
				this.policiesDisplayed.find(
					x => x.uuid === policy.uuid
				).default = !policy.default;

				this.utilsService.openSnackBar(response[ 'message' ], '');
			})
			.catch(err => {
				this.loading = false;
				this.utilsService.openSnackBar(err, '');
			});
	}

	sortPolicies(policies) {
		this.policiesDisplayed = policies.sort((a, b) => {
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

	receiveNS(ns) {
		if (ns === 'None') {
			this.policiesDisplayed = this.policies;
			return;
		}

		ns = {
			vendor: ns.split(':')[ 0 ],
			name: ns.split(':')[ 1 ].split(' - v')[ 0 ],
			version: ns.split(':')[ 1 ].split(' - v')[ 1 ]
		};

		this.policiesDisplayed = this.policies.filter(x =>
			this.utilsService.compareObjects(x.ns, ns)
		);
	}

	deletePolicy(policy) {
		this.loading = true;

		this.servicePlatformService
			.deleteOneRuntimePolicy(policy.uuid)
			.then(response => {
				this.utilsService.openSnackBar(response[ 'message' ], '');
				this.requestRuntimePolicies();
			})
			.catch(err => {
				this.loading = false;
				this.utilsService.openSnackBar(err, '');
			});
	}

	openPolicy(policy) {
		this.router.navigate([ policy.uuid ], { relativeTo: this.route });
	}

	createNew() {
		this.router.navigate([ 'new' ], { relativeTo: this.route });
	}
}
