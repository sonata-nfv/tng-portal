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
	async getServiceGuarantees(ns) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.guarantees + '/' + ns;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return this.parseGuaranteesData(response[ 'guaranteeTerms' ]);
		} catch (error) {
			console.error(error);
		}
	}

	private parseGuaranteesData(guarantees) {
		return guarantees ?
			guarantees.map(guarantee => {
				const nameToDisplay = guarantee[ 'guarantee_name' ] + ': ' + guarantee[ 'guarantee_threshold' ] + ' ' + guarantee[ 'guarantee_unit' ];
				return {
					uuid: guarantee[ 'guaranteeID' ],
					name: nameToDisplay,
					guaranteeName: guarantee[ 'guarantee_name' ],
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
			}) : [];
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
		const headers = this.authService.getAuthHeadersSLAMngr();
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
	 * Retrieves the actual placement policy selected
	 */
	async getPlacementPolicy() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.placementPolicies;

		try {
			return await this.http.get(url, { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Generates a Placement Policy
	 *
	 * @param placementPolicy Data of the desired Placement Policy
	 */
	async postPlacementPolicy(placementPolicy) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.placementPolicies;

		try {
			return await this.http.post(url, placementPolicy, { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
		}
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
			this.config.baseSP + this.config.runtimePolicies + '?' + search
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
	async getOneRuntimePolicy(uuid: string) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.runtimePolicies + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return {
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
				slaUUID: response[ 'sla_id' ],
				sla: response[ 'sla_name' ],
				policyRules: response[ 'pld' ][ 'policyRules' ],
				monitoringRules: response[ 'pld' ][ 'monitoring_rules' ]
			};
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Generates a Runtime Policy
	 *
	 * @param policy Data of the desired Runtime Policy
	 */
	async postOneRuntimePolicy(policy) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.runtimePoliciesUI;

		try {
			return await this.http.post(url, policy, { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Sets a Runtime Policy as default
	 *
	 * @param uuid UUID of the desired Runtime Policy
	 * @param defaultPolicy Boolean setting the binding with its ns
	 * @param nsid UUID of the desired NS
	 */
	async setDefaultRuntimePolicy(uuid, defaultPolicy, nsid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.runtimePoliciesDefault + uuid;
		const data = {
			defaultPolicy,
			nsid
		};

		try {
			return await this.http.patch(url, data, { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Binds a Runtime Policy to an SLA
	 *
	 * @param uuid UUID of the desired Runtime Policy
	 * @param slaid UUID of the desired SLA
	 * @param nsid UUID of the desired NS
	 */
	async bindRuntimePolicy(uuid, data) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.runtimePoliciesBind + uuid;

		try {
			return await this.http.patch(url, data, { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
		}
	}

	async duplicateOneRuntimePolicy(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.runtimePoliciesClone + uuid;

		try {
			return await this.http.get(url, { headers: headers }).toPromise();
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Removes the specified runtime policy from the database
	 *
	 * @param uuid UUID of the desired Runtime Policy.
	 */
	async deleteOneRuntimePolicy(uuid: string) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.runtimePolicies + '/' + uuid;

		try {
			return await this.http.delete(url, { headers: headers, responseType: 'text' }).toPromise();
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves a list of Generated Actions.
	 * Either following a search pattern or not.
	 *
	 * @param search [Optional] Actions attributes that must be
	 *                          matched by the returned list of
	 *                          Generated Actions.
	 */
	async getGeneratedActions(search?) {
		const headers = this.authService.getAuthHeaders();
		const url =
			search ?
				this.config.baseSP + this.config.runtimePoliciesActions + '?' + search
				: this.config.baseSP + this.config.runtimePoliciesActions;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						correlationUUID: item.correlation_id,
						vnfName: item.action[ 'vnf_name' ],
						scalingType: item.action[ 'scaling_type' ],
						serviceInstanceUUID: item.action[ 'service_instance_id' ],
						value: item.action[ 'value' ],
						date: item.inDateTime
					};
				}) : [];
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
}
