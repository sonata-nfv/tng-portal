import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';

import { AuthService } from '../authentication/auth.service';
import { UtilsService } from '../shared/services/common/utils.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: [ './menu.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit, OnDestroy {
	subscription: Subscription;
	menu: string;
	section: string;
	subsection: string;
	username: string;
	email: string;

	@ViewChild('sidenav')
	sideNav: MatSidenav;
	constructor(
		private authService: AuthService,
		private utilsService: UtilsService,
		private router: Router
	) { }

	ngOnInit() {
		this.username = localStorage.getItem('username');
		// TODO get email from user data request
		this.email = 'example@gmail.com';

		// Maintain menu status when reload
		this.maintainStatus();

		// Maintain status of the menu when moving through different components
		this.subscription = this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.maintainStatus();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	setMenu(e, buttonId) {
		buttonId === 'dashboard' || buttonId === 'users' || buttonId === 'platforms' ?
			this.sideNav.close() : this.sideNav.open();

		switch (buttonId) {
			case 'dashboard':
				this.router.navigate([ '/dashboard' ]);
				break;
			case 'users':
				this.router.navigate([ '/users' ]);
				break;
			case 'platforms':
				this.router.navigate([ '/platforms' ]);
				break;
			case 'settings':
				this.section = 'endpoint';
				this.router.navigate([ '/settings' ]);
				break;
			case 'validation-and-verification':
				this.section = 'vv-test-plans';
				this.router.navigate([ '/validation-and-verification' ]);
				break;
			case 'service-platform':
				this.section = 'sp-packages';
				this.router.navigate([ 'service-platform' ]);
				break;
			case 'service-management':
				this.section = 'sm-network-services';
				this.router.navigate([ 'service-management' ]);
				break;
			case 'sdk':
				this.section = 'sdk';
				this.router.navigate(['/sdk']);
				break;
			default:
				this.router.navigate([ '/dashboard' ]);
		}
		this.menu = buttonId;
	}

	setSection(e, buttonId) {
		switch (buttonId) {
			case 'endpoint':
				this.router.navigate([ 'settings/endpoint' ]);
				break;
			case 'vim':
				this.router.navigate([ 'settings/vim' ]);
				break;
			case 'wim':
				this.router.navigate([ 'settings/wim' ]);
				break;
			case 'vv-test-plans':
				this.router.navigate([ 'validation-and-verification/test-plans' ]);
				break;
			case 'vv-packages':
				this.router.navigate([ 'validation-and-verification/packages' ]);
				break;
			case 'vv-network-services':
				this.router.navigate([ 'validation-and-verification/network-services' ]);
				break;
			case 'vv-functions':
				this.router.navigate([ 'validation-and-verification/functions' ]);
				break;
			case 'vv-tests':
				this.router.navigate([ 'validation-and-verification/tests' ]);
				break;
			case 'sp-packages':
				this.router.navigate([ 'service-platform/packages' ]);
				break;
			case 'sp-network-services':
				this.router.navigate([ 'service-platform/network-services' ]);
				break;
			case 'sp-functions':
				this.router.navigate([ 'service-platform/functions' ]);
				break;
			case 'sp-policies':
				this.subsection = 'placement-policy';
				this.router.navigate([ 'service-platform/policies/placement-policy' ]);
				break;
			case 'sp-slas':
				this.subsection = 'sla-templates';
				this.router.navigate([ 'service-platform/slas/sla-templates' ]);
				break;
			case 'sp-slices':
				this.router.navigate([ 'service-platform/slices/slice-templates' ]);
				break;
			case 'sm-slices':
				this.subsection = 'slice-templates';
				this.router.navigate([ 'service-management/slices/slice-templates' ]);
				break;
			case 'sm-network-services':
				this.subsection = 'services';
				this.router.navigate([ 'service-management/network-services/services' ]);
				break;
			case 'sm-requests':
				this.router.navigate([ 'service-management/requests' ]);
				break;
			case 'sm-licenses':
				this.router.navigate([ 'service-management/licenses' ]);
				break;
			case 'sdk-generator':
				this.router.navigate(['sdk/descriptor-generator']);
				break;
			case 'sdk-edit':
				this.router.navigate(['sdk/descriptor-displayer']);
				break;
		}
		this.section = buttonId;
	}

	setSubsection(e, buttonId) {
		switch (buttonId) {
			case 'placement-policy':
				this.subsection = 'placement-policy';
				this.router.navigate([ 'service-platform/policies/placement-policy' ]);
				break;
			case 'runtime-policies':
				this.subsection = 'runtime-policies';
				this.router.navigate([ 'service-platform/policies/runtime-policies' ]);
				break;
			case 'generated-actions':
				this.subsection = 'generated-actions';
				this.router.navigate([ 'service-platform/policies/generated-actions' ]);
				break;
			case 'sla-templates':
				this.subsection = 'sla-templates';
				this.router.navigate([ 'service-platform/slas/sla-templates' ]);
				break;
			case 'sla-agreements':
				this.subsection = 'sla-agreements';
				this.router.navigate([ 'service-platform/slas/sla-agreements' ]);
				break;
			case 'sla-violations':
				this.subsection = 'sla-violations';
				this.router.navigate([ 'service-platform/slas/sla-violations' ]);
				break;
			case 'slice-templates':
				this.subsection = 'slice-templates';
				this.router.navigate([ 'service-management/slices/slice-templates' ]);
				break;
			case 'slice-instances':
				this.subsection = 'slice-instances';
				this.router.navigate([ 'service-management/slices/slice-instances' ]);
				break;
			case 'services':
				this.subsection = 'services';
				this.router.navigate([ 'service-management/network-services/services' ]);
				break;
			case 'network-service-instances':
				this.subsection = 'network-service-instances';
				this.router.navigate([ 'service-management/network-services/network-service-instances' ]);
				break;
			default:
				this.subsection = buttonId;
				break;
		}
	}

	maintainStatus() {
		const url = this.router.url.substr(1).split('/');
		this.menu = url[ 0 ] ? url[ 0 ] : 'dashboard';
		this.menu && (this.menu === 'dashboard' || this.menu === 'platforms' || this.menu === 'sdk') ?
			this.sideNav.close() : this.sideNav.open();

		if (url.length > 1) {
			switch (this.menu) {
				case 'validation-and-verification':
					this.section = 'vv-' + url[ 1 ];
					break;
				case 'service-platform':
					this.section = 'sp-' + url[ 1 ];
					break;
				case 'service-management':
					this.section = 'sm-' + url[ 1 ];
					break;
				default:
					this.section = url[ 1 ];
					break;
			}
		}
		if (url.length > 2) {
			this.subsection = url[ 2 ];
		}
	}

	async logout() {
		await this.authService.logout();
		this.router.navigate([ '/login' ]);
	}
}
