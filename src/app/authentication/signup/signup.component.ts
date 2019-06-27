import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
	selector: 'app-signup',
	animations: [
		trigger('enterAnimation', [
			transition(
				':enter',
				[
					style({ transform: 'translateX(100%)', opacity: 0 }),
					animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
				]),
			transition(
				':leave',
				[
					style({ transform: 'translateX(0)', opacity: 1 }),
					animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
				])
		])
	],
	templateUrl: './signup.component.html',
	styleUrls: [ './signup.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
	show = false;
	signupForm: FormGroup;
	roles = [ 'Developer', 'Customer' ];

	constructor(private authService: AuthService, private router: Router) { }

	ngOnInit() {
		this.signupForm = new FormGroup({
			username: new FormControl(null, Validators.required),
			password: new FormControl(null, Validators.required),
			confirmPassword: new FormControl(null, Validators.required),
			email: new FormControl(null, [ Validators.required, Validators.email ]),
			role: new FormControl(null, Validators.required),
			termsOfUsage: new FormControl()
		});

		this.signupForm.valueChanges.subscribe(value => this.onFormChanges(value));
	}

	private onFormChanges(values) {
		if (values.confirmPassword && values.password !== values.confirmPassword) {
			this.signupForm.get('confirmPassword').setErrors({ 'incorrect': true });
		}
	}

	receiveRole(role) {
		this.signupForm.get('role').setValue(role);
	}

	async signup() {
		const user = {
			username: this.signupForm.get('username').value,
			name: this.signupForm.get('username').value,
			password: this.signupForm.get('password').value,
			email: this.signupForm.get('email').value,
			role: this.signupForm.get('role').value.toLocaleLowerCase()
		};

		const userRegistered = await this.authService.signup(user);

		if (userRegistered) {
			this.router.navigate([ '/registered' ]);
		} else {
			this.signupForm.get('username').setErrors({ 'incorrect': true });
			this.signupForm.get('email').setErrors({ 'incorrect': true });
		}
	}
}
