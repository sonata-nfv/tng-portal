import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ConfigService } from './shared/services/config/config.service';

@Injectable()
export class CanDisplayGuard implements CanActivate {
	constructor(private router: Router, private configService: ConfigService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const shouldBeDisplayed = this.configService.features_available.indexOf(route.data.section.toUpperCase()) > -1 ?
			true
			: false;

		if (shouldBeDisplayed) {
			return true;
		}

		this.router.navigate([ '/dashboard' ]);
		return false;
	}
}
