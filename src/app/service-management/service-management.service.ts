import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from '../shared/services/config/config.service';
import { AuthService } from '../authentication/auth.service';
import { UtilsService } from '../shared/services/common/utils.service';

@Injectable()
export class ServiceManagementService {
	authHeaders: HttpHeaders;
	request_uuid: string;
	unknown = '-';

	constructor(
		private authService: AuthService,
		private config: ConfigService,
		private utilsService: UtilsService,
		private http: HttpClient
	) { }

	/**
	 * Retrieves a list of Slices Instances.
	 * Either following a search pattern or not.
	 *
	 * @param search [Optional] Instances attributes that must be
	 *                          matched by the returned list of
	 *                          Slices instances.
	 */
	async getSlicesInstances(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search !== undefined ?
			this.config.baseSP + this.config.slicesInstances + search :
			this.config.baseSP + this.config.slicesInstances;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						uuid: item.uuid,
						name: item.name,
						vendor: item.vendor,
						template: item[ 'nst-name' ],
						status: item[ 'nsi-status' ]
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
	 * Retrieves a Slices Instances by UUID
	 *
	 * @param uuid UUID of the desired Slices Instance.
	 */
	async getOneSliceInstance(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.slicesInstances + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return {
				uuid: response[ 'uuid' ],
				name: response[ 'name' ],
				nstRef: response[ 'nst-ref' ],
				nstName: response[ 'nst-name' ],
				nstVersion: response[ 'nst-version' ],
				vendor: response[ 'vendor' ],
				status: response[ 'nsi-status' ],
				errorMsg: response[ 'errorLog' ],
				instantiationTime: response[ 'instantiateTime' ],
				description: response[ 'description' ],
				nsrList: response[ 'nsr-list' ] ? response[ 'nsr-list' ].map(item => {
					return {
						uuid: item[ 'nsrId' ],
						nsrName: item[ 'nsrName' ],
						slaName: item[ 'sla-name' ],
						isShared: item[ 'isshared' ] ? 'Yes' : 'No',
						status: item[ 'working-status' ]
					};
				}) : [],
				sliceVirtualLinks: response[ 'vldr-list' ] ? response[ 'vldr-list' ].map(item => {
					return {
						id: item[ 'id' ],
						networkName: item[ 'name' ],
						mngmtNetwork: item[ 'mgmt-network' ] ? 'Yes' : 'No',
						vldStatus: item[ 'vld-status' ],
						type: item[ 'type' ]
					};
				}) : []
			};
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Generates a Slice Instance
	 *
	 * @param instance Data of the desired Slice Instance.
	 */
	async postOneSliceInstance(instance) {
		const headers = this.authService.getAuthHeadersContentTypeJSON();
		const url = this.config.baseSP + this.config.requests;

		try {
			return await this.http.post(url, instance, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Terminates a Slice Instance by UUID
	 *
	 * @param uuid UUID of the desired Slices Instance.
	 */
	async postOneSliceInstanceTermination(uuid) {
		const headers = this.authService.getAuthHeadersContentTypeJSON();
		const url = this.config.baseSP + this.config.requests;
		const terminateTime = {
			'instance_uuid': uuid,
			'request_type': 'TERMINATE_SLICE'
		};

		try {
			return await this.http.post(url, terminateTime, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}


	}

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
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

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
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

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
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Retrieves the metrics measured in each function by UUID
	 *
	 * @param instanceUUID UUID of the desired network service instance.
	 */
	async getMonitoringMetrics(instanceUUID, functionUUID) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.monitoringData + `/${ instanceUUID }/metrics`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();

			const result = new Array();
			if (response[ 'vnfs' ] && response[ 'vnfs' ].length) {
				const vnfs = response[ 'vnfs' ].filter(item => item.vnf_id === functionUUID);
				vnfs.forEach(unit => {
					unit.vdus.forEach(item => result.push({ vduID: item.vdu_id, metrics: item.metrics }));
				});
			}

			return result;
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Network service instantiation
	 *
	 * @param body Body of the instantiation request
	 */
	async postOneNSInstance(body) {
		const headers = this.authService.getAuthHeadersContentTypeJSON();
		const url = this.config.baseSP + this.config.requests;

		try {
			return await this.http.post(url, body, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	* Terminates a Network Service Instance by UUID
	*
	* @param uuid UUID of the desired Network Service Instance.
	*/
	async postOneNSInstanceTermination(uuid) {
		const headers = this.authService.getAuthHeadersContentTypeJSON();
		const url = this.config.baseSP + this.config.requests;
		const data = {
			instance_uuid: uuid,
			request_type: 'TERMINATE_SERVICE'
		};

		try {
			return await this.http.post(url, data, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Manually scales an instance out or in
	 *
	 * @param requestBody Body of the request to scale out or in
	 */
	async postScaleAction(requestBody) {
		const headers = this.authService.getAuthHeadersContentTypeJSON();
		const url = this.config.baseSP + this.config.requests;

		try {
			return await this.http.post(url, requestBody, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
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
					name: item.name || 'Unknown',
					duration: item.duration ? this.parseDuration(item.duration) : this.unknown,
					type: item.request_type,
					createdAt: item.created_at,
					status: item.status
				})) : [];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

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
					name: response[ 'name' ] || 'Unknown',
					status: response[ 'status' ],
					type: response[ 'request_type' ],
					updatedAt: response[ 'updated_at' ],
					duration: response[ 'duration' ] ? this.parseDuration(response[ 'duration' ]) : this.unknown,
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
					egresses: response[ 'egresses' ],
					error: response[ 'error' ]
				} : [];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	private parseDuration(duration) {
		const result = duration.toFixed(3).toString();
		const secs = result.split('.')[ 0 ];
		return `${ secs }s`;
	}

	/**
     * Retrieves a list of licenses.
     * Either following a search pattern or not.
     *
     * @param search [Optional] License attributes that must be
     *                          matched by the returned list.
     */
	async getLicences(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search ?
			this.config.baseSP + this.config.licenses + search :
			this.config.baseSP + this.config.licenses;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(function (item) {
					return {
						uuid: item.nsi_uuid,
						type: item.license_type,
						status: item.license_status,
						customerUsername: item.cust_username,
						currentInstances: item.current_instances,
						allowedInstances: item.allowed_instances,
						expirationDate: item.license_exp_date,
						slaUUID: item.sla_uuid,
						nsUUID: item.ns_uuid
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
	* Retrieves one license by UUID
	*
	* @param uuid UUID of the desired license.
	*/
	async getOneLicense(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.licenses + '/' + uuid;

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
	 * Retrieves the status of the license. Whether it is private or public for the user
	 *
	 * @param slaUUID UUID of the SLA
	 * @param nsUUID UUID of the network service
	 */
	async getLicenseStatus(slaUUID, nsUUID) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.licenseStatus + '/' + slaUUID + '/' + nsUUID;

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
	* Buys a license
	*
	* @param license License data of the new license.
	*/
	async postOneLicense(license) {
		const headers = this.authService.getAuthHeadersContentTypeURLEncoded();
		const url = this.config.baseSP + this.config.buyLicense;

		try {
			return await this.http.post(url, this.utilsService.urlEncode(license), { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}
}
