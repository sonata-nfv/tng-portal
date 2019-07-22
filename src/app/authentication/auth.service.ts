import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/services/config/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthService {
	authHeaders: HttpHeaders;

	constructor(private config: ConfigService, private http: HttpClient) {
		this.setAuthHeaders();
	}

	async login(username: string, password: string) {
		const url = this.config.baseSP + this.config.login;

		const data = {
			username: username,
			password: password
		};

		this.removeLocalStorage();
		this.setAuthHeaders();

		try {
			const login = await this.http.post(url, data, { headers: this.authHeaders }).toPromise();
			localStorage.setItem('token', login[ 'token' ]);
			localStorage.setItem('username', username);
			this.setAuthHeaders();
			return login;
		} catch (error) {
			console.error(error);
			return error.error.error;
		}
	}

	async logout() {
		this.removeLocalStorage();
		const url = this.config.baseSP + this.config.login;

		try {
			await this.http.delete(url, { headers: this.authHeaders });
			return;
		} catch (error) {
			console.error(error);
		}
	}

	private removeLocalStorage() {
		localStorage.removeItem('token');
		localStorage.removeItem('username');
	}

	async signup(user: object) {
		const url = this.config.baseSP + this.config.register;

		try {
			return await this.http.post(url, user, { headers: this.authHeaders }).toPromise();
		} catch (error) {
			console.error(error);
			return error.error.error;
		}
	}

	private setAuthHeaders() {
		localStorage.getItem('token') ?
			this.authHeaders = new HttpHeaders()
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
			: this.authHeaders = new HttpHeaders()
				.set('Content-Type', 'application/json');
	}

	async getUserRoles() {
		const url = this.config.baseSP + this.config.roles;

		try {
			const roles = await this.http.get(url, { headers: this.authHeaders }).toPromise();
			return roles && roles[ 'roles' ] ?
				Object.keys(roles[ 'roles' ]).filter(role => role.toLowerCase() !== 'admin') :
				[ '-' ];
		} catch (error) {
			console.error(error);
			return [ '-' ];
		}
	}

	getAuthHeaders() {
		return this.authHeaders;
	}

	getAuthHeadersSLAMngr() {
		return localStorage.getItem('token') ?
			new HttpHeaders()
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
			: new HttpHeaders()
				.set('Content-Type', 'application/x-www-form-urlencoded');
	}

	isAuthenticated(): boolean {
		return localStorage.getItem('token') ? true : false;
	}
}
