import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from '../shared/services/config/config.service';
import { AuthService } from '../authentication/auth.service';
import { UtilsService } from '../shared/services/common/utils.service';

@Injectable()
export class ServiceManagementService {
	authHeaders: HttpHeaders;
	request_uuid: string;

	constructor(
		private utilsService: UtilsService,
		private authService: AuthService,
		private config: ConfigService,
		private http: HttpClient
	) { }

	/**
     * Retrieves a list of Network Service instances.
     * Either following a search pattern or not.
     *
     * @param search [Optional] Instance attributes that must be
     *                          matched by the returned list of
     *                          NS instances.
     */
	async getNSInstances(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search ?
			this.config.baseSP + this.config.serviceRecords + search
			: this.config.baseSP + this.config.serviceRecords;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => ({
					uuid: item.uuid,
					name: item.instance_name || 'Unknown',
					status: item.status,
					serviceID: item.descriptor_reference,
					createdAt: item.created_at,
					version: item.version
				})) : [];
		} catch (error) {
			console.error(error);
		}
	}

	/**
     * Retrieves a Network Service Instance by UUID
     *
     * @param uuid UUID of the desired NS instance.
     */
	async getOneNSInstance(uuid: string) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.serviceRecords + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return {
				uuid: response[ 'uuid' ],
				name: response[ 'instance_name' ] || 'Unknown',
				status: response[ 'status' ],
				serviceID: response[ 'descriptor_reference' ],
				serviceVersion: response[ 'descriptor_version' ],
				version: response[ 'version' ],
				updatedAt: response[ 'updated_at' ],
				vnf: response[ 'network_functions' ]
			};
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves a VNF by UUID
	 *
	 * @param uuid UUID of the desired VNF.
	 */
	async getOneFunctionRecord(uuid: string) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.functionRecords + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return {
				uuid: response[ 'uuid' ],
				name: response[ 'name' ],
				version: response[ 'version' ],
				status: response[ 'status' ],
				updatedAt: response[ 'updated_at' ],
				descriptorRef: response[ 'descriptor_reference' ],
				descriptorVersion: response[ 'descriptor_version' ],
				vdus: response[ 'virtual_deployment_units' ],
				cdus: response[ 'cloudnative_deployment_units' ]
			};
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Network service instantiation
	 *
	 * @param name Name given to the instance
	 * @param service Information about the service about to be instantiated
	 * @param ingress Ingress points of the instantiation
	 * @param egress Egress points of the instantiation
	 * @param sla Selected service level agreement in the instantiation
	 */
	postNSRequest(
		name: string,
		serviceUUID: Object,
		ingress: Array<Object>,
		egress: Array<Object>,
		slaUUID: string
	) {
		return new Promise((resolve, reject) => {
			const headers = new HttpHeaders();
			const data = {
				name,
				sla_id: slaUUID,
				service_uuid: serviceUUID,
				ingresses: ingress,
				egresses: egress
			};

			this.http
				.post(this.config.baseSP + this.config.requests, data, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					resolve(response[ 'name' ]);
				})
				.catch(err =>
					reject(
						'There was an error while trying to instantiate this network service'
					)
				);
		});
	}

	/*
	* Terminates a Network Service Instance by UUID
	*
	* @param uuid UUID of the desired Network Service Instance.
	*/
	async postOneNSInstanceTermination(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.requests;
		const data = {
			instance_uuid: uuid,
			request_type: 'TERMINATE_SERVICE'
		};

		try {
			return await this.http.post(url, data, { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
		}
	}

	getLicences(): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();
			this.http
				.get(this.config.baseSP + this.config.licenses, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					resolve(response);
				})
				.catch(err => reject(err.statusText));
		});
	}
}
