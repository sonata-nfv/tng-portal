import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	errorMsg: string;

	constructor(private authService: AuthService, private router: Router) { }

	ngOnInit() {
		this.loginForm = new FormGroup({
			username: new FormControl('', Validators.required),
			password: new FormControl('', Validators.required)
		});
	}

	async login(loginForm: FormGroup) {
		const username = loginForm.get('username').value;
		const password = loginForm.get('password').value;
		const response = await this.authService.login(username, password);

		if (response && response instanceof Object) {
			this.router.navigate([ '/' ]);
		} else {
			this.errorMsg = response;

			if (this.errorMsg.toLowerCase().includes('user') || this.errorMsg.toLowerCase().includes('password')) {
				this.loginForm.get('password').setErrors({ 'incorrect': true });
			}
		}
	}
}


