import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
	selector: 'app-signup',
	animations: [
		trigger('enterAnimation', [
			transition(':enter', [style({ transform: 'translateX(100%)', opacity: 0 }), animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))]),
			transition(':leave', [style({ transform: 'translateX(0)', opacity: 1 }), animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))])
		])
	],
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
	show: boolean = false;
	userErrorString: string;
	passwordErrorString: string;
	emailErrorString: string;
	validPassword: boolean;
	signupForm: FormGroup;

	// TODO Request roles options from the API
	roles = ['Developer', 'Customer'];

	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit() {
		this.initForm();
	}

	private initForm() {
		this.signupForm = new FormGroup({
			username: new FormControl(),
			password: new FormControl(),
			confirmPassword: new FormControl(),
			email: new FormControl(null, Validators.email),
			role: new FormControl(null, Validators.required),
			termsOfUsage: new FormControl()
		});
		this.signupForm.valueChanges.subscribe(value => this._onFormChanges(value));
	}

	private _onFormChanges(values) {
		// Check if both password fields match
		// Possibility to add password restrictions
		if (values.confirmPassword !== null) {
			if (values.password !== values.confirmPassword) {
				this.passwordErrorString = '*Passwords do not match.';
				this.validPassword = false;
			} else {
				this.passwordErrorString = null;
				this.validPassword = true;
			}
		}
		if (this.signupForm.controls.email.invalid && this.signupForm.controls.email.value != '' && this.signupForm.controls.email.value != null) {
			this.emailErrorString = '*This is not a valid email.';
		} else {
			this.emailErrorString = null;
		}
		this.userErrorString = null;
	}

	signup(signupForm: FormGroup) {
		this.authService
			.signup(this.signupForm.value.username, this.signupForm.value.password, this.signupForm.value.email, this.signupForm.value.role)
			.then(() => {
				// Set welcome route when user is registered
				this.router.navigate(['/registered']);
			})
			.catch(err => {
				this.userErrorString = '*' + err;
				this.emailErrorString = '*' + err;
			});
	}

	receiveRole($event) {
		this.signupForm.controls.role.setValue($event);
	}
}
