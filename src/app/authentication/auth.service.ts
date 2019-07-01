import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/services/config/config.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

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
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		const url = this.config.baseSP + this.config.login;

		try {
			await this.http.delete(url, { headers: this.authHeaders });
			return;
		} catch (error) {
			console.error(error);
		}
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
		this.authHeaders = new HttpHeaders();
		this.authHeaders.set('Content-Type', 'application/json');
		this.authHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
	}

	getAuthHeaders() {
		return this.authHeaders;
	}

	isAuthenticated(): boolean {
		return localStorage.getItem('token') ? true : false;
	}
}
