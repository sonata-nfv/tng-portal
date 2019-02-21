import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from '../shared/services/config/config.service';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class SettingsService {
    authHeaders: HttpHeaders;

    constructor(
        private authService: AuthService,
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
    getVims(search?): Promise<any> {
        const headers = this.authService.getAuthHeaders();
        const url =
            search !== undefined
                ? this.config.baseSP + this.config.vimSettings + search
                : this.config.baseSP + this.config.vimSettings;

        return this.http.get(url, { headers: headers }).toPromise()
            .then(response => {
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
            }).catch(error => {
                console.error(error);
            });
    }

    /**
    * Retrieves a VIM by UUID
    *
    * @param uuid VIM UUID of the desired VIM.
    */
    getOneVim(uuid): Promise<any> {
        const headers = this.authService.getAuthHeaders();
        const url = this.config.baseSP + this.config.vimSettings + '/' + uuid;

        return this.http.get(url, { headers: headers }).toPromise()
            .then(response => {
                return response;
            }).catch(error => {
                console.error(error);
            });
    }

    /**
     * Generates a VIM
     *
     * @param vim Data of the desired VIM.
     */
    postVim(type, vim): Promise<any> {
        const headers = this.authService.getAuthHeaders();
        const url = type === 'Openstack' ?
            this.config.baseSP + this.config.vimOpenstackSettings : this.config.baseSP + this.config.vimK8sSettings;

        return this.http.post(url, vim, { headers: headers }).toPromise()
            .then(response => {
                return ('VIM ' + response[ 'name' ] + ' created');
            }).catch(error => {
                console.error(error);
            });
    }

    /**
     * Deletes a VIM
     *
     * @param uuid UUID of the desired VIM.
     */
    deleteVim(uuid): Promise<any> {
        const headers = this.authService.getAuthHeaders();
        const url = this.config.baseSP + this.config.vimSettings + '/' + uuid;

        return this.http.delete(url, { headers: headers }).toPromise()
            .then(() => {
                return ('VIM deleted');
            }).catch(error => {
                console.error(error);
            });
    }

    /**
    * Retrieves a list of WIMs.
    * Either following a search pattern or not.
    *
    * @param search [Optional] WIMs attributes that must be
    *                          matched by the returned list.
    */
    getWims(search?): Promise<any> {
        const headers = this.authService.getAuthHeaders();
        const url =
            search !== undefined
                ? this.config.baseSP + this.config.wimSettings + search
                : this.config.baseSP + this.config.wimSettings;

        return this.http.get(url, { headers: headers }).toPromise()
            .then(response => {
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
            }).catch(error => {
                console.error(error);
            });
    }

    /**
   * Retrieves a WIM by UUID
   *
   * @param uuid WIM UUID of the desired WIM.
   */
    getOneWim(uuid): Promise<any> {
        const headers = this.authService.getAuthHeaders();
        const url = this.config.baseSP + this.config.wimSettings + '/' + uuid;

        return this.http.get(url, { headers: headers }).toPromise()
            .then(response => {
                return response;
            }).catch(error => {
                console.error(error);
            });
    }

}
