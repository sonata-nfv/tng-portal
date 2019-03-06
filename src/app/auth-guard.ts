import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './authentication/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private authService: AuthService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.authService.isAuthenticated()) {
			return true;
		}

		// this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
		this.router.navigate([ '/login' ]);
		return false;
	}
}
