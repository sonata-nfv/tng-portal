import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

import { AuthService } from '../authentication/auth.service';
import { UtilsService } from '../shared/services/common/utils.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: [ './menu.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
	menu: string;
	section: string;
	subsection: string;
	username: string;
	email: string;

	@ViewChild('sidenav')
	sideNav: MatSidenav;
	constructor(
		private authService: AuthService,
		private router: Router,
		private utilsService: UtilsService
	) { }

	ngOnInit() {
		this.username = localStorage.getItem('username');
		// TODO get email from user data request
		this.email = 'example@gmail.com';

		// Maintain menu status when reload
		this.maintainStatus();
	}

	copyToClipboard(value) {
		this.utilsService.copyToClipboard(value);
	}

	setMenu(e, buttonId) {
		buttonId === 'dashboard' || buttonId === 'users' || buttonId === 'platforms' || buttonId === 'sdk' ?
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
				this.section = 'vim';
				this.router.navigate([ '/settings' ]);
				break;
			case 'sdk':
				this.router.navigate([ '/sdk' ]);
				break;
			case 'validation-and-verification':
				this.section = 'vv-packages';
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
			default:
				this.router.navigate([ '/dashboard' ]);
		}
		this.menu = buttonId;
	}

	setSection(e, buttonId) {
		switch (buttonId) {
			case 'vim':
				this.router.navigate([ 'settings/vim' ]);
				break;
			case 'wim':
				this.router.navigate([ 'settings/wim' ]);
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
				this.subsection = 'slices-templates';
				this.router.navigate([ 'service-platform/slices/slices-templates' ]);
				break;
			case 'sm-network-services':
				this.router.navigate([ 'service-management/network-services' ]);
				break;
			case 'sm-requests':
				this.router.navigate([ 'service-management/requests' ]);
				break;
			case 'sm-network-service-instances':
				this.router.navigate([ 'service-management/network-service-instances' ]);
				break;
			case 'licenses':
				this.subsection = '';
				this.router.navigate([ 'service-management/licenses' ]);
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
			case 'slices-templates':
				this.subsection = 'slices-templates';
				this.router.navigate([ 'service-platform/slices/slices-templates' ]);
				break;
			case 'slices-instances':
				this.subsection = 'slices-instances';
				this.router.navigate([ 'service-platform/slices/slices-instances' ]);
				break;
			case 'slices-requests':
				this.subsection = 'slices-requests';
				this.router.navigate([ 'service-platform/slices/slices-requests' ]);
				break;
			case 'service-licenses':
				this.subsection = 'service-licenses';
				this.router.navigate([ 'service-management/licenses/service-licenses' ]);
				break;
			case 'user-licenses':
				this.subsection = 'user-licenses';
				this.router.navigate([ 'service-management/licenses/user-licenses' ]);
				break;
		}
		this.subsection = buttonId;
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

	logout() {
		this.router.navigate([ '/login' ]);
		this.authService
			.logout()
			.then()
			.catch(err => {
				// console.log(err);
			});
	}
}
