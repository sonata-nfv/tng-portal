import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from '../shared/services/config/config.service';
import { AuthService } from '../authentication/auth.service';
import { reject } from 'q';

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
    getVims(search?): any {
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
                reject(error);
            });
    }
}
