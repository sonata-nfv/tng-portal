import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from '../config/config.service';
import { AuthService } from '../../../authentication/auth.service';
import { UtilsService } from './utils.service';

@Injectable()
export class CommonService {
	authHeaders: HttpHeaders;
	request_uuid: string;
	NA = 'Not available';

	constructor(
		private authService: AuthService,
		private utilsService: UtilsService,
		private config: ConfigService,
		private http: HttpClient,
	) { }

	/**
     * Retrieves a list of Packages.
     * Either following a search pattern or not.
     *
     * @param search [Optional] Packages attributes that must be
     *                          matched by the returned list of
     *                          packages.
     */
	getPackages(section, search?): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();
			let url: string;

			if (section === 'V&V') {
				url =
					search !== undefined
						? this.config.baseVNV + this.config.packages + search
						: this.config.baseVNV + this.config.packages;
			} else {
				url =
					search !== undefined
						? this.config.baseSP + this.config.packages + search
						: this.config.baseSP + this.config.packages;
			}

			this.http
				.get(url, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					if (response instanceof Array) {
						resolve(
							response.map(item => {
								return {
									uuid: item.uuid,
									name: item.pd.name,
									vendor: item.pd.vendor,
									version: item.pd.version,
									createdAt: this.utilsService.formatUTCDate(item.created_at),
									status: this.utilsService.capitalizeFirstLetter(item.status),
									type: 'Public'
								};
							})
						);
					} else {
						reject('There was an error fetching the packages');
					}
				})
				.catch(err => reject('There was an error fetching the packages'));
		});
	}

	/**
     * Retrieves a Package by UUID
     *
     * @param uuid UUID of the desired Package.
     */
	getOnePackage(section, uuid: string): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();
			const uri = section === 'vnv' ? this.config.baseVNV : this.config.baseSP;

			this.http
				.get(uri + this.config.packages + '/' + uuid, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					resolve({
						uuid: response[ 'uuid' ],
						name: response[ 'pd' ][ 'name' ],
						author: response[ 'pd' ][ 'maintainer' ],
						createdAt: this.utilsService.formatUTCDate(response[ 'created_at' ]),
						updatedAt: this.utilsService.formatUTCDate(response[ 'updated_at' ]),
						vendor: response[ 'pd' ][ 'vendor' ],
						version: response[ 'pd' ][ 'version' ],
						status: this.utilsService.capitalizeFirstLetter(response[ 'status' ]),
						type: 'Public',
						ns: this.getPackageContent(response[ 'pd' ][ 'package_content' ], 'ns'),
						vnf: this.getPackageContent(
							response[ 'pd' ][ 'package_content' ],
							'vnf'
						),
						tests: this.getPackageContent(
							response[ 'pd' ][ 'package_content' ],
							'tests'
						)
					});
				})
				.catch(err => reject('There was an error fetching the package'));
		});
	}

	getPackageContent(content, type) {
		let obj: string;
		const result = new Array();

		content.forEach(item => {
			if (item[ 'content-type' ] === 'application/vnd.5gtango.nsd') {
				obj = 'ns';
			} else if (item[ 'content-type' ] === 'application/vnd.5gtango.vnfd') {
				obj = 'vnf';
			} else if (item[ 'content-type' ] === 'application/vnd.5gtango.tstd') {
				obj = 'tests';
			} else {
				obj = null;
			}

			if (obj === type) {
				result.push({
					vendor: item.id.vendor,
					name: item.id.name,
					version: item.id.version
				});
			}
		});

		return result;
	}

	/**
     * Retrieves a list of Functions.
     * Either following a search pattern or not.
     *
     * @param search [Optional] Packages attributes that must be
     *                          matched by the returned list of
     *                          packages.
     */
	getFunctions(section, search?): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			let url: string;
			if (section === 'VALIDATION AND VERIFICATION') {
				url =
					search !== undefined
						? this.config.baseVNV + this.config.functions + search
						: this.config.baseVNV + this.config.functions;
			} else {
				url =
					search !== undefined
						? this.config.baseSP + this.config.functions + search
						: this.config.baseSP + this.config.functions;
			}

			this.http
				.get(url, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					if (response instanceof Array) {
						resolve(
							response.map(item => {
								return {
									uuid: item.uuid,
									name: item.vnfd.name,
									vendor: item.vnfd.vendor,
									status: this.utilsService.capitalizeFirstLetter(item.status),
									version: item.vnfd.version,
									type: 'public'
								};
							})
						);
					} else {
						reject('There was an error fetching the functions');
					}
				})
				.catch(err => reject('There was an error fetching the functions'));
		});
	}

	/**
     * Retrieves a list of SLA Templates.
     * Either following a search pattern or not.
     *
     * @param search [Optional] Template attributes that must be
     *                          matched by the returned list of
     *                          SLA Templates.
     */
	async getSLATemplates(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search !== undefined ?
			this.config.baseSP + this.config.slaTemplates + search
			: this.config.baseSP + this.config.slaTemplates;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						uuid: item.uuid,
						vendor: item.slad.vendor,
						name: item.slad.name,
						version: item.slad.version,
						nsUUID: item.slad.sla_template.service.ns_uuid,
						ns: item.slad.sla_template.service.ns_name,
						expirationDate: item.slad.sla_template.expiration_date,
						license: item.slad.licences.service_based.service_licence_type
					};
				}) : [];
		} catch (error) {
			console.error(error);
		}
	}

	/**
     * Retrieves a list of Available Network Services.
     * Either following a search pattern or not.
     *
     * @param search [Optional] Network Service attributes that
     *                          must be matched by the returned
     *                          list of NS.
     */
	async getNetworkServices(section, search?) {
		const headers = this.authService.getAuthHeaders();
		let url: string;
		section === 'V&V' ?
			url = search ?
				this.config.baseVNV + this.config.services + search
				: this.config.baseVNV + this.config.services
			: url = search ?
				this.config.baseSP + this.config.services + search
				: this.config.baseSP + this.config.services;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => ({
					uuid: item.uuid,
					name: item.nsd.name,
					serviceId: item.uuid,
					vendor: item.nsd.vendor,
					version: item.nsd.version,
					status: item.status
				})) : [];
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves a Network Service by UUID
	 *
	 * @param uuid UUID of the desired Network Service.
	 */
	getOneNetworkService(section, uuid: string): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();
			const uri = section === 'vnv' ? this.config.baseVNV : this.config.baseSP;

			this.http
				.get(uri + this.config.services + '/' + uuid, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					if (response.hasOwnProperty('nsd')) {
						resolve({
							uuid: response[ 'uuid' ],
							name: response[ 'nsd' ][ 'name' ],
							author: response[ 'nsd' ][ 'author' ],
							version: response[ 'nsd' ][ 'version' ],
							status: this.utilsService.capitalizeFirstLetter(response[ 'status' ]),
							vendor: response[ 'nsd' ][ 'vendor' ],
							serviceID: response[ 'uuid' ],
							type: response[ 'user_licence' ],
							description: response[ 'nsd' ][ 'description' ],
							createdAt: this.utilsService.formatUTCDate(response[ 'created_at' ]),
							updatedAt: this.utilsService.formatUTCDate(response[ 'updated_at' ]),
							vnf: response[ 'nsd' ][ 'network_functions' ]
						});
					} else {
						reject('There was an error while fetching the network service!');
					}
				})
				.catch(err =>
					reject('There was an error while fetching the network service!')
				);
		});
	}

	/**
	 * Retrieves a list of Network Service requests.
	 * Either following a search pattern or not.
	 *
	 * @param search [Optional] Request attributes that must be
	 *                          matched by the returned list of
	 *                          NS requests.
	 */
	async getRequests(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search !== undefined ?
			this.config.baseSP + this.config.requests + search :
			this.config.baseSP + this.config.requests;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => ({
					requestId: item.id,
					name: item.name,
					serviceName: item[ 'service' ] ? item.service.name : this.NA,
					type: item.request_type,
					createdAt: item.created_at,
					status: item.status
				})) : [];
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves a Network Service request by UUID
	 *
	 * @param uuid UUID of the desired NS request.
	 */
	async getOneRequest(uuid: string) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.requests + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response.hasOwnProperty('id') ?
				{
					uuid: response[ 'id' ],
					name: response[ 'name' ],
					status: response[ 'status' ],
					type: response[ 'request_type' ],
					updatedAt: response[ 'updated_at' ],
					slaUUID: response[ 'sla_id' ],
					serviceVendor: response[ 'service' ] ?
						response[ 'service' ][ 'vendor' ] : null,
					serviceName: response[ 'service' ] ?
						response[ 'service' ][ 'name' ] : null,
					serviceVersion: response[ 'service' ] ?
						response[ 'service' ][ 'version' ] : null,
					serviceUUID: response[ 'service' ] ?
						response[ 'service' ][ 'uuid' ] : null,
					blacklist: response[ 'blacklist' ],
					ingresses: response[ 'ingresses' ],
					egresses: response[ 'egresses' ]
				} : [];
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves the existing vims represented by the city name
	 */
	requestVims(): any {
		return [ 'bcn-1', 'bcn-2', 'bcn-3', 'bcn-4' ];
	}
}
