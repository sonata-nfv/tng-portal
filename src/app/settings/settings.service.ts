import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from '../shared/services/config/config.service';
import { AuthService } from '../authentication/auth.service';
import { UtilsService } from '../shared/services/common/utils.service';

@Injectable()
export class SettingsService {
	authHeaders: HttpHeaders;

	constructor(
		private authService: AuthService,
		private utilsService: UtilsService,
		private config: ConfigService,
		private http: HttpClient,
	) { }

	/**
     * Retrieves a list of VIMs.
     * Either following a search pattern or not.
     *
     * @param search [Optional] VIMs attributes that must be
     *                          matched by the returned list.
     */
	async getVims(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search ? this.config.baseSP + this.config.vimSettings + search
			: this.config.baseSP + this.config.vimSettings;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						uuid: item.uuid,
						name: item.name,
						country: item.country,
						city: item.city,
						endpoint: item.endpoint,
						type: item.type
					};
				}) : [];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
    * Retrieves a VIM by UUID
    *
    * @param uuid VIM UUID of the desired VIM.
    */
	async getOneVim(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.vimSettings + '/' + uuid;

		try {
			return await this.http.get(url, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
    * Retrieves all VIMs monitoring configuration
    *
    */
	async getVimsConfig() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.base + this.config.monitoringTargets;

		try {
			return await this.http.get(url, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
     * Generates a VIM
     *
     * @param vim Data of the desired VIM.
     */
	async postVim(type, vim) {
		const headers = this.authService.getAuthHeadersContentTypeJSON();
		const url = type === 'Openstack' ?
			this.config.baseSP + this.config.vimOpenstackSettings : this.config.baseSP + this.config.vimK8sSettings;

		try {
			return await this.http.post(url, vim, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
     * Updates a VIM
     *
     * @param vim Data of the desired VIM.
     */
	async patchVim(type, uuid, vim) {
		const headers = this.authService.getAuthHeadersContentTypeJSON();
		let url = type === 'Openstack' ?
			this.config.baseSP + this.config.vimOpenstackSettings : this.config.baseSP + this.config.vimK8sSettings;
		url = url + '/' + uuid;

		try {
			return await this.http.patch(url, vim, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
     * Deletes a VIM
     *
     * @param uuid UUID of the desired VIM.
     */
	async deleteVim(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.vimSettings + '/' + uuid;

		try {
			return await this.http.delete(url, { headers: headers }).toPromise();

		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
    * Retrieves a list of WIMs.
    * Either following a search pattern or not.
    *
    * @param search [Optional] WIMs attributes that must be
    *                          matched by the returned list.
    */
	async getWims(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search ? this.config.baseSP + this.config.wimSettings + search
			: this.config.baseSP + this.config.wimSettings;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						uuid: item.uuid,
						name: item.name,
						vims: item.vim_list,
						endpoint: item.endpoint,
						type: item.type
					};
				}) : [];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}

	}

	/**
	 * Retrieves a WIM by UUID
	 *
	 * @param uuid WIM UUID of the desired WIM.
	 */
	async getOneWim(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.wimSettings + '/' + uuid;

		try {
			return await this.http.get(url, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Generates a WIM
	 *
	 * @param wim Data of the desired WIM.
	 */
	async postWim(wim) {
		const headers = this.authService.getAuthHeadersContentTypeJSON();
		const url = this.config.baseSP + this.config.tapiSettings;

		try {
			return await this.http.post(url, wim, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
			return error.error.message;
		}
	}

	/**
	 * Updates a WIM
	 *
	 * @param wim Data of the desired WIM.
	 */
	async patchWim(type, uuid, vim) {
		const headers = this.authService.getAuthHeadersContentTypeJSON();
		const url = this.config.baseSP + this.config.tapiSettings + '/' + uuid;

		try {
			return await this.http.patch(url, vim, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Deletes a WIM
	 *
	 * @param uuid UUID of the desired WIM.
	 */
	async deleteWim(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.wimSettings + '/' + uuid;

		try {
			return await this.http.delete(url, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

}
