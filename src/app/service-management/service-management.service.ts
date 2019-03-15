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
	getNSInstances(search?): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();
			const url =
				search !== undefined
					? this.config.baseSP + this.config.serviceRecords + search
					: this.config.baseSP + this.config.serviceRecords;

			this.http
				.get(url, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					if (response instanceof Array) {
						resolve(
							response.map(item => ({
								uuid: item.uuid,
								name: item.instance_name,
								status: this.utilsService.capitalizeFirstLetter(item.status),
								serviceID: item.descriptor_reference,
								createdAt: this.utilsService.formatUTCDate(item.created_at),
								version: item.version
							}))
						);
					} else {
						reject();
					}
				})
				.catch(
					err =>
						err.status === 404
							? resolve([])
							: reject(
								'There was an error fetching the network service instances'
							)
				);
		});
	}

	/**
     * Retrieves a Network Service Instance by UUID
     *
     * @param uuid UUID of the desired NS instance.
     */
	getOneNSInstance(uuid: string): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			this.http
				.get(this.config.baseSP + this.config.serviceRecords + '/' + uuid, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					if (response.hasOwnProperty('uuid')) {
						resolve({
							uuid: response[ 'uuid' ],
							name: response[ 'instance_name' ],
							status: this.utilsService.capitalizeFirstLetter(response[ 'status' ]),
							serviceID: response[ 'descriptor_reference' ],
							version: response[ 'version' ],
							updatedAt: this.utilsService.formatUTCDate(
								response[ 'updated_at' ]
							),
							vnf: response[ 'network_functions' ]
						});
					} else {
						reject();
					}
				})
				.catch(err =>
					reject('There was an error fetching the network service instance')
				);
		});
	}

	/**
     * Retrieves a VNF by UUID
     *
     * @param uuid UUID of the desired VNF.
     */
	getOneFunctionRecord(uuid: string): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			this.http
				.get(this.config.baseSP + this.config.functionRecords + '/' + uuid, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					resolve({
						uuid: response[ 'uuid' ],
						status: this.utilsService.capitalizeFirstLetter(response[ 'status' ]),
						descriptorRef: response[ 'descriptor_reference' ],
						descriptorVersion: response[ 'descriptor_reference' ],
						name: response[ 'descriptor_version' ],
						version: response[ 'version' ],
						updatedAt: this.utilsService.formatUTCDate(response[ 'updated_at' ]),
						vdus: response[ 'virtual_deployment_units' ]
					});
				})
				.catch(err => reject('There was an error fetching the VNF ' + uuid));
		});
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
	postOneNSInstanceTermination(uuid): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			const data = {
				instance_uuid: uuid,
				request_type: 'TERMINATE_SERVICE'
			};

			this.http
				.post(this.config.baseSP + this.config.requests, data, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					resolve('Instance ' + response[ 'name' ] + ' terminated');
				})
				.catch(err =>
					reject('There was an error terminating the network service instance')
				);
		});
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
