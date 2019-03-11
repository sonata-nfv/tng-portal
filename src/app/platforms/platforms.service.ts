import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from '../shared/services/config/config.service';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class PlatformsService {
	authHeaders: HttpHeaders;

	constructor(
		private authService: AuthService,
		private config: ConfigService,
		private http: HttpClient
	) { }

	/**
     * Retrieves a list of VIMs.
     * Either following a search pattern or not.
     *
     * @param search [Optional] VIMs attributes that must be
     *                          matched by the returned list.
     */
	async getPlatforms(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search ? this.config.baseVNV + this.config.platformSettings + search
			: this.config.baseVNV + this.config.platformSettings;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response : [];
		} catch (error) {
			console.error(error);
		}
	}

	/**
 	* Deletes a platform
 	*
 	* @param uuid UUID of the desired WIM.
 	*/
	async deletePlatform(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.platformSettings + '/' + uuid;

		try {
			return await this.http.delete(url, { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
		}
	}

}
