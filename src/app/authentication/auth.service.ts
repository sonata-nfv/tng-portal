import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/services/config/config.service';
import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders
} from '@angular/common/http';

@Injectable()
export class AuthService {
	authHeaders: HttpHeaders;

	constructor(private config: ConfigService, private http: HttpClient) {
		this.setAuthHeaders();
	}

	login(username: string, password: string): any {
		return new Promise((resolve, reject) => {
			const headers = new HttpHeaders();
			headers.set('Content-Type', 'application/json');

			const data = {
				username: username,
				password: password
			};

			this.http
				.post(
					'https://sp.int3.sonata-nfv.eu/api/v2/' + this.config.login,
					data,
					{
						headers: headers
					}
				)
				.subscribe(
					response => {
						localStorage.setItem('token', response[ 'token' ][ 'access_token' ]);
						localStorage.setItem('username', username);
						this.setAuthHeaders();
						resolve();
					},
					(error: HttpErrorResponse) => {
						// reject(error.error.error.message);
						reject('*Your password or your user/email are wrong.');
					}
				);
		});
	}

	userData(uuid: string): any {
		return new Promise((resolve, reject) => {
			const headers = new HttpHeaders();
			headers.set('Content-Type', 'application/json');

			this.http
				.get(this.config.baseSP + this.config.register + uuid, {
					headers: headers
				})
				.subscribe(
					response => {
						localStorage.setItem('username', response[ 'username' ]);
						localStorage.setItem('email', response[ 'email' ]);
						localStorage.setItem('user_type', response[ 'user_type' ]);
						resolve();
					},
					(error: HttpErrorResponse) => {
						reject(error.error.error.message);
					}
				);
		});
	}

	logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		return new Promise((resolve, reject) => {
			const headers = this.getAuthHeaders();

			this.http
				.delete(this.config.baseSP + this.config.login, {
					headers: headers
				})
				.subscribe(
					() => {
						resolve();
					},
					(error: HttpErrorResponse) => {
						reject(error);
					}
				);
		});
	}

	signup(
		username: string,
		password: string,
		email: string,
		userType: string
	): any {
		return new Promise((resolve, reject) => {
			const headers = new HttpHeaders();
			headers.set('Content-Type', 'application/json');

			const data = {
				username: username,
				password: password,
				email: email,
				user_type: userType.toLocaleLowerCase()
			};
			this.http
				.post(
					'https://sp.int3.sonata-nfv.eu/api/v2/' + this.config.register,
					data,
					{
						headers: headers
					}
				)
				.subscribe(
					response => {
						resolve();
					},
					(error: HttpErrorResponse) => {
						// reject(error.error.error.message);
						reject('Username or email already in use.');
					}
				);
		});
	}

	private setAuthHeaders() {
		this.authHeaders = new HttpHeaders();
		// this.authHeaders.set(
		//   'Content-Type',
		//   'application/json'
		// );
		// this.authHeaders.set(
		//   'Authorization',
		//   'Bearer ' + localStorage.getItem('token')
		// );
	}

	getAuthHeaders() {
		return this.authHeaders;
		// return new HttpHeaders();
	}

	isAuthenticated(): boolean {
		return true;
		// if (localStorage.getItem('token')) {
		//   this.setAuthHeaders();
		//   return true;
		// }
		// return false;
	}
}
