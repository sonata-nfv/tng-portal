import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from '../shared/services/config/config.service';
import { AuthService } from '../authentication/auth.service';
import { UtilsService } from '../shared/services/common/utils.service';

@Injectable()
export class ServicePlatformService {
	authHeaders: HttpHeaders;
	request_uuid: string;
	// pagination: string = '?page_size=20&page_number=1';

	constructor(
		private utilsService: UtilsService,
		private authService: AuthService,
		private config: ConfigService,
		private http: HttpClient
	) { }

	/**
     * Retrieves a Function by UUID
     *
     * @param uuid UUID of the desired Function.
     */
	getOneFunction(uuid: string): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();
			this.http
				.get(this.config.baseSP + this.config.functions + '/' + uuid, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					resolve({
						uuid: response[ 'uuid' ],
						name: response[ 'vnfd' ][ 'name' ],
						author: response[ 'vnfd' ][ 'author' ],
						createdAt: this.utilsService.formatUTCDate(response[ 'created_at' ]),
						updatedAt: this.utilsService.formatUTCDate(response[ 'updated_at' ]),
						vendor: response[ 'vnfd' ][ 'vendor' ],
						version: response[ 'vnfd' ][ 'version' ],
						type: 'Public',
						status: this.utilsService.capitalizeFirstLetter(response[ 'status' ]),
						description: response[ 'vnfd' ][ 'description' ]
					});
				})
				.catch(err => reject('There was an error fetching the function'));
		});
	}

	/**
     * Retrieves a SLA Template by UUID
     *
     * @param uuid UUID of the desired SLA Template.
     */
	async getOneSLATemplate(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.slaTemplates + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return {
				uuid: response[ 'uuid' ],
				name: response[ 'slad' ][ 'name' ],
				vendor: response[ 'slad' ][ 'vendor' ],
				version: response[ 'slad' ][ 'version' ],
				providerName: response[ 'slad' ][ 'sla_template' ][ 'provider_name' ],
				updatedAt: response[ 'updated_at' ],
				expirationDate: response[ 'slad' ][ 'sla_template' ][ 'expiration_date' ],
				ns: response[ 'slad' ][ 'sla_template' ][ 'service' ][ 'ns_uuid' ],
				nsName: response[ 'slad' ][ 'sla_template' ][ 'service' ][ 'ns_name' ],
				license: response[ 'slad' ][ 'licences' ][ 'service_based' ][ 'service_licence_type' ],
				licenseInstances: response[ 'slad' ][ 'licences' ][ 'service_based' ][ 'allowed_service_instances' ],
				licenseExpirationDate: response[ 'slad' ][ 'licences' ][ 'service_based' ][ 'service_licence_expiration_date' ],
				storedGuarantees: this.parseGuaranteesData(response[ 'slad' ][ 'sla_template' ][ 'service' ][ 'guaranteeTerms' ])
			};
		} catch (error) {
			console.error(error);
		}
	}

	/**
     * Retrieves a list with all the service guarantees
     */
	async getServiceGuarantees() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.guarantees;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return this.parseGuaranteesData(response[ 'guaranteeTerms' ]);
		} catch (error) {
			console.error(error);
		}
	}

	private parseGuaranteesData(guarantees) {
		return guarantees.map(guarantee => {
			return {
				uuid: guarantee[ 'guaranteeID' ],
				name: guarantee[ 'guarantee_name' ],
				definition: guarantee[ 'guarantee_definition' ],
				threshold: guarantee[ 'guarantee_threshold' ],
				unit: guarantee[ 'guarantee_unit' ],
				slos: guarantee[ 'target_slo' ].map(slo => {
					return {
						kpi: slo.target_kpi,
						operator: slo.target_operator,
						value: slo.target_value,
						period: slo.target_period
					};
				})
			};
		});
	}

	/**
	 * Retrive a list with all the flavors for a service
	 * @param uuid identifier of the network service
	 */
	async getFlavors(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.flavors + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response : [];
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 *
	 * @param ns UUID of the NS for this SLA template
	 * @param sla UUID of the SLA template
	 */
	async getOneFlavor(ns, sla) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.flavors + '/' + ns + '/' + sla;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response[ 'd_flavour_name' ] || 'None';
		} catch (error) {
			console.error(error);
		}
	}

	/**
     * Creates a new SLA Template.
     *
     * @param template Object containing the nsd_uuid, guaranteeId, expireDate
     *                 and templateName for the creation of a new template.
     */
	async postOneSLATemplate(template) {
		const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
		const url = this.config.baseSP + this.config.slaTemplates;

		try {
			return await this.http.post(url, this.utilsService.urlEncode(template), { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
			return error.error.ERROR;
		}
	}

	/**
	 * Removes the specified template from the database
	 *
	 * @param uuid UUID of the desired SLA Template.
	 */
	async deleteOneSLATemplate(uuid: string) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.slaTemplates + '/' + uuid;

		try {
			const response = await this.http.delete(url, { headers: headers, responseType: 'text' }).toPromise();
			return response;
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves a list of SLA Agreements.
	 * Either following a search pattern or not.
	 *
	 * @param search [Optional] Agreement attributes that must be
	 *                          matched by the returned list of
	 *                          SLA Agreements.
	 */
	async getSLAAgreements(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search ?
			this.config.baseSP + this.config.slaAgreements + search
			: this.config.baseSP + this.config.slaAgreements;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response[ 'agreements' ] ?
				response[ 'agreements' ].map(item => {
					return {
						uuid: item.sla_uuid,
						name: item.sla_name,
						nsiUUID: item.nsi_uuid,
						nsName: item.ns_name,
						customer: item.cust_username,
						date: item.sla_date,
						status: item.sla_status,
						license: item.license_type
					};
				}) : [];
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves a SLA Agreement by UUID
	 *
	 * @param uuid UUID of the desired SLA Agreement.
	 */
	async getOneSLAAgreement(slaUUID: string, nsUUID: string) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.slaAgreements + '/' + slaUUID + '/' + nsUUID;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return {
				uuid: response[ 'uuid' ],
				updatedAt: response[ 'updated_at' ],
				status: response[ 'status' ],
				name: response[ 'slad' ][ 'name' ],
				vendor: response[ 'slad' ][ 'vendor' ],
				templateVersion: response[ 'slad' ][ 'version' ],
				license: response[ 'slad' ][ 'licences' ][ 'service_based' ][ 'service_licence_type' ],
				licenseInstances: response[ 'slad' ][ 'licences' ][ 'service_based' ][ 'allowed_service_instances' ],
				licenseExpirationDate: response[ 'slad' ][ 'licences' ][ 'service_based' ][ 'service_licence_expiration_date' ],
				slaTemplateName: response[ 'slad' ][ 'sla_template' ][ 'template_name' ],
				slaTemplateInitiator: response[ 'slad' ][ 'sla_template' ][ 'template_initiator' ],
				providerName: response[ 'slad' ][ 'sla_template' ][ 'provider_name' ],
				offerDate: response[ 'slad' ][ 'sla_template' ][ 'offer_date' ],
				offeredDate: response[ 'slad' ][ 'sla_template' ][ 'offered_date' ],
				expirationDate: response[ 'slad' ][ 'sla_template' ][ 'expiration_date' ],
				customerEmail: response[ 'slad' ][ 'sla_template' ][ 'customer_info' ][ 'cust_email' ],
				customerUsername: response[ 'slad' ][ 'sla_template' ][ 'customer_info' ][ 'cust_username' ],
				nsUUID: response[ 'slad' ][ 'sla_template' ][ 'service' ][ 'ns_uuid' ],
				nsName: response[ 'slad' ][ 'sla_template' ][ 'service' ][ 'ns_name' ],
				nsVendor: response[ 'slad' ][ 'sla_template' ][ 'service' ][ 'ns_vendor' ],
				nsVersion: response[ 'slad' ][ 'sla_template' ][ 'service' ][ 'ns_version' ],
				guarantees: this.parseGuaranteesData(response[ 'slad' ][ 'sla_template' ][ 'service' ][ 'guaranteeTerms' ]),
			};
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves a list of SLA Violations.
	 * Either following a search pattern or not.
	 *
	 * @param search [Optional] Violation attributes that must be
	 *                          matched by the returned list of
	 *                          SLA Violations.
	 */
	getSLAViolations(search?): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();
			const url =
				search !== undefined
					? this.config.baseSP + this.config.slaViolations + search
					: this.config.baseSP + this.config.slaViolations;

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
									nsInstanceUUID: item.nsi_uuid,
									slaUUID: item.sla_uuid,
									date: this.utilsService.formatUTCDate(item.violation_time),
									customerUUID: item.cust_uuid
								};
							})
						);
					} else {
						reject('There was an error while fetching the SLA violations');
					}
				})
				.catch(err =>
					reject('There was an error while fetching the SLA violations')
				);
		});
	}

	/**
	 * Retrieves a list of Runtime Policies.
	 * Either following a search pattern or not.
	 *
	 * @param search [Optional] Policy attributes that must be
	 *                          matched by the returned list of
	 *                          Runtime Policies.
	 */
	async getRuntimePolicies(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search ?
			this.config.baseSP + this.config.runtimePolicies + search
			: this.config.baseSP + this.config.runtimePolicies;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.filter(policy => policy.ns_uuid).map(item => {
					return {
						uuid: item.uuid,
						name: item.pld.name,
						version: item.pld.version,
						vendor: item.pld.vendor,
						ns: item.pld.network_service,
						ns_uuid: item.ns_uuid,
						sla: item.sla_name || 'None',
						default: item.default_policy,
						enforced: item.enforced ? 'Yes' : 'No'
					};
				}) : [];
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves a Runtime Policy by UUID
	 *
	 * @param uuid UUID of the desired Runtime Policy.
	 */
	getOneRuntimePolicy(uuid: string) {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			this.http
				.get(this.config.baseSP + this.config.runtimePolicies + '/' + uuid, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					resolve({
						uuid: response[ 'uuid' ],
						name: response[ 'pld' ][ 'name' ],
						vendor: response[ 'pld' ][ 'vendor' ],
						updatedAt: this.utilsService.formatUTCDate(response[ 'updated_at' ]),
						nsUUID: response[ 'ns_uuid' ],
						nsName: response[ 'pld' ][ 'network_service' ][ 'name' ],
						nsVendor: response[ 'pld' ][ 'network_service' ][ 'vendor' ],
						nsVersion: response[ 'pld' ][ 'network_service' ][ 'version' ],
						version: response[ 'pld' ][ 'version' ],
						default: response[ 'default_policy' ],
						enforced: response[ 'enforced' ] ? 'Yes' : 'No',
						sla: response[ 'sla_id' ],
						policyRules: [],
						monitoringRules: []
					});
				})
				.catch(err =>
					reject('There was an error while loading the policy information')
				);
		});
	}

	/**
	 * Generates a Runtime Policy
	 *
	 * @param policy Data of the desired Runtime Policy
	 */
	postOneRuntimePolicy(policy): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			this.http
				.post(this.config.baseSP + this.config.runtimePolicies, policy, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					resolve();
				})
				.catch(err => reject(err.statusText));
		});
	}

	/**
	 * Sets a Runtime Policy as default
	 *
	 * @param uuid UUID of the desired Runtime Policy
	 * @param defaultPolicy Boolean setting the binding with its ns
	 * @param nsid UUID of the desired NS
	 */
	setDefaultRuntimePolicy(uuid, defaultPolicy, nsid) {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			const data = {
				defaultPolicy,
				nsid
			};

			this.http
				.patch(
					this.config.baseSP + this.config.runtimePoliciesDefault + uuid,
					data,
					{
						headers: headers
					}
				)
				.toPromise()
				.then(response => {
					if (response[ 'code' ] === 'INVALID') {
						reject('There was an error setting the policy as default!');
					}
					resolve(response);
				})
				.catch(err =>
					reject('There was an error setting the policy as default!')
				);
		});
	}

	/**
	 * Binds a Runtime Policy to an SLA
	 *
	 * @param uuid UUID of the desired Runtime Policy
	 * @param slaid UUID of the desired SLA
	 * @param nsid UUID of the desired NS
	 */
	bindRuntimePolicy(uuid, slaid, nsid) {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			const data = {
				slaid,
				nsid
			};

			this.http
				.patch(
					this.config.baseSP + this.config.runtimePoliciesBind + uuid,
					data,
					{
						headers: headers
					}
				)
				.toPromise()
				.then(response => {
					if (response[ 'code' ] === 'INVALID') {
						reject('There was an error binding the sla!');
					}
					resolve(response);
				})
				.catch(err => reject('There was an error binding the sla!'));
		});
	}

	/**
	 * Removes the specified runtime policy from the database
	 *
	 * @param uuid UUID of the desired Runtime Policy.
	 */
	deleteOneRuntimePolicy(uuid: string): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			this.http
				.delete(this.config.baseSP + this.config.runtimePolicies + '/' + uuid, {
					headers: headers,
					responseType: 'text'
				})
				.toPromise()
				.then(response => {
					resolve(JSON.parse(response));
				})
				.catch(err => {
					reject('There was an error while deleting the policy!');
				});
		});
	}

	/**
	 * Retrieves a list of Generated Actions.
	 * Either following a search pattern or not.
	 *
	 * @param search [Optional] Actions attributes that must be
	 *                          matched by the returned list of
	 *                          Generated Actions.
	 */
	getGeneratedActions(search?): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();
			const url =
				search !== undefined
					? this.config.baseSP + this.config.runtimePoliciesActions + search
					: this.config.baseSP + this.config.runtimePoliciesActions;

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
									correlationUUID: item.correlation_id,
									vnfName: item.action[ 'vnf_name' ],
									scalingType: item.action[ 'scaling_type' ],
									serviceInstanceUUID: item.action[ 'service_instance_id' ],
									value: item.action[ 'value' ],
									date: item.inDateTime
								};
							})
						);
					} else {
						reject('There was an error while fetching the generated actions');
					}
				})
				.catch(err =>
					reject('There was an error while fetching the generated actions')
				);
		});
	}

	/**
	 * Retrieves a list of Slices Templates.
	 * Either following a search pattern or not.
	 *
	 * @param search [Optional] Template attributes that must be
	 *                          matched by the returned list of
	 *                          Slices Templates.
	 */
	async getSlicesTemplates(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search ? this.config.baseSP + this.config.slicesTemplates + search :
			this.config.baseSP + this.config.slicesTemplates;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						uuid: item.uuid,
						name: item.nstd.name,
						version: item.nstd.version,
						vendor: item.nstd.vendor,
						usageState: item.nstd.usageState,
						author: item.nstd.author,
						status: item.status
					};
				}) : [];
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves a Slices Template by UUID
	 *
	 * @param uuid UUID of the desired Slices Template.
	 */
	async getOneSliceTemplate(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.slicesTemplates + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return {
				uuid: response[ 'uuid' ],
				status: response[ 'status' ],
				name: response[ 'nstd' ][ 'name' ],
				author: response[ 'nstd' ][ 'author' ],
				createdAt: response[ 'created_at' ],
				updatedAt: response[ 'updated_at' ],
				version: response[ 'nstd' ][ 'version' ],
				vendor: response[ 'nstd' ][ 'vendor' ],
				description: response[ 'nstd' ][ 'description' ],
				notificationType: response[ 'nstd' ][ 'notificationTypes' ],
				userDefinedData: response[ 'nstd' ][ 'userDefinedData' ],
				usageState: response[ 'nstd' ][ 'usageState' ],
				onboardingState: response[ 'nstd' ][ 'onboardingState' ],
				operationalState: response[ 'nstd' ][ 'operationalState' ],
				services: response[ 'nstd' ] ? response[ 'nstd' ][ 'slice_ns_subnets' ].map(item => {
					return {
						uuid: item[ 'id' ],
						nsdName: item[ 'nsd-name' ],
						isShared: item[ 'is-shared' ] ? 'Yes' : 'No',
						slaName: item[ 'sla-name' ]
					};
				}) : [],
				sliceVirtualLinks: response[ 'nstd' ] ? response[ 'nstd' ][ 'slice_vld' ].map(item => {
					return {
						networkName: item[ 'name' ],
						mngmtNetwork: item[ 'mgmt-network' ] ? 'Yes' : 'No',
						type: item[ 'type' ]
					};
				}) : []
			};
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Creates a Slice Template
	 *
	 * @param template Data of the new slice template
	 */
	async postOneSliceTemplate(template) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.slicesTemplates;

		try {
			return await this.http.post(url, template, { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Removes the specified template from the database
	 *
	 * @param uuid UUID of the desired Slices Template.
	 */
	async deleteOneSlicesTemplate(uuid: string) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.slicesTemplates + '/' + uuid;

		try {
			return await this.http.delete(url, { headers: headers, responseType: 'text' }).toPromise();
		} catch (error) {
			console.error(error);
		}
	}

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
				qiValue: response[ '5qiValue' ],
				instantiationTime: response[ 'instantiateTime' ],
				description: response[ 'description' ],
				nsrList: response[ 'nsr-list' ] ? response[ 'nsr-list' ].map(item => {
					return {
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
			console.error(error);
		}
	}

	/**
	 * Generates a Slice Instance
	 *
	 * @param instance Data of the desired Slice Instance.
	 */
	async postOneSliceInstance(instance) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.requests;

		try {
			return await this.http.post(url, instance, { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Terminates a Slice Instance by UUID
	 *
	 * @param uuid UUID of the desired Slices Instance.
	 */
	async postOneSliceInstanceTermination(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.requests;
		const terminateTime = {
			'instance_uuid': uuid,
			'request_type': 'TERMINATE_SLICE'
		};

		try {
			return await this.http.post(url, terminateTime, { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
		}


	}
}
