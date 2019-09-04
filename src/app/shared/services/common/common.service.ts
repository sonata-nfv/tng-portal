import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from '../config/config.service';
import { AuthService } from '../../../authentication/auth.service';
import { UtilsService } from './utils.service';

@Injectable()
export class CommonService {
	authHeaders: HttpHeaders;
	request_uuid: string;
	unknown = '-';

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
	async getPackages(section, search?) {
		const headers = this.authService.getAuthHeaders();
		let url: string;

		if (section === 'V&V') {
			url = search ?
				this.config.baseVNV + this.config.packages + search
				: this.config.baseVNV + this.config.packages;
		} else {
			url = search ?
				this.config.baseSP + this.config.packages + search
				: this.config.baseSP + this.config.packages;
		}

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						uuid: item.uuid,
						name: item.pd.name,
						vendor: item.pd.vendor,
						version: item.pd.version,
						createdAt: item.created_at,
						status: item.status
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
     * Retrieves a Package by UUID
     *
     * @param uuid UUID of the desired Package.
     */
	async getOnePackage(section, uuid: string) {
		const headers = this.authService.getAuthHeaders();
		const url = section === 'vnv' ? this.config.baseVNV : this.config.baseSP;

		try {
			const response = await this.http.get(url + this.config.packages + '/' + uuid, { headers: headers }).toPromise();
			const content = this.parsePackageContent(response[ 'pd' ][ 'package_content' ]);
			const packageData = {
				uuid: response[ 'uuid' ],
				name: response[ 'pd' ][ 'name' ],
				author: response[ 'pd' ][ 'maintainer' ],
				createdAt: response[ 'created_at' ],
				updatedAt: response[ 'updated_at' ],
				vendor: response[ 'pd' ][ 'vendor' ],
				version: response[ 'pd' ][ 'version' ],
				status: response[ 'status' ]
			};

			return Object.assign({ }, packageData, content);
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	private parsePackageContent(content) {
		const ns = [];
		const vnf = [];
		const tests = [];

		content.forEach(item => {
			if (item[ 'content-type' ].endsWith('.nsd')) {
				ns.push({
					uuid: item.uuid,
					vendor: item.id.vendor,
					name: item.id.name,
					version: item.id.version
				});
			} else if (item[ 'content-type' ].endsWith('.vnfd')) {
				vnf.push({
					uuid: item.uuid,
					vendor: item.id.vendor,
					name: item.id.name,
					version: item.id.version
				});
			} else if (item[ 'content-type' ].endsWith('.tstd')) {
				tests.push({
					uuid: item.uuid,
					vendor: item.id.vendor,
					name: item.id.name,
					version: item.id.version
				});
			}
		});

		return { ns, vnf, tests };
	}

	/**
     * Retrieves a list of Functions.
     * Either following a search pattern or not.
     *
     * @param search [Optional] Function attributes that must be
     *                          matched by the returned list of
     *                          functions.
     */
	async getFunctions(section, search?) {
		const headers = this.authService.getAuthHeaders();
		let url: string;
		if (section === 'VALIDATION AND VERIFICATION') {
			url = search ?
				this.config.baseVNV + this.config.functions + search
				: this.config.baseVNV + this.config.functions;
		} else {
			url = search ?
				this.config.baseSP + this.config.functions + search
				: this.config.baseSP + this.config.functions;
		}

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			if (response instanceof Array) {
				const tango = response.filter(funct => funct.platform.toLowerCase() === '5gtango')
					.map(item => {
						return {
							uuid: item.uuid,
							name: item.vnfd.name,
							vendor: item.vnfd.vendor,
							status: item.status,
							version: item.vnfd.version,
						};
					});

				const osm = response.filter(funct => funct.platform.toLowerCase() === 'osm')
					.map(item => {
						return {
							uuid: item.uuid,
							name: item.vnfd[ 'vnfd:vnfd-catalog' ].vnfd.name,
							vendor: item.vnfd[ 'vnfd:vnfd-catalog' ].vnfd.vendor,
							status: item.status,
							version: item.vnfd[ 'vnfd:vnfd-catalog' ].vnfd.version,
						};
					});

				return tango.concat(osm);
			}
			return [];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
     * Retrieves a list of monitoring rules per function.
     *
     * @param search [Optional] Function attributes that must be
     *                          matched by the returned function
     */
	async getFunctionMonitoringParameters(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.functions + search;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();

			const monitoringParameters = new Array();
			if (response[ 0 ][ 'vnfd' ][ 'virtual_deployment_units' ]) {
				response[ 0 ][ 'vnfd' ][ 'virtual_deployment_units' ].map(vdu => {
					if (vdu[ 'monitoring_parameters' ]) {
						for (const param of vdu.monitoring_parameters) {
							const vnf = response[ 0 ][ 'vnfd' ][ 'name' ];
							monitoringParameters.push({
								uuid: vnf + ':' + vdu.id + ':' + param.name,
								name: vnf + ' : ' + param.name,
								condition: param.name,
								unit: param.unit,
								vduID: vdu.id,
								vnfName: vnf,
								vnfVendor: response[ 0 ][ 'vnfd' ][ 'vendor' ],
								vnfVersion: response[ 0 ][ 'vnfd' ][ 'version' ]
							});
						}
					}
				});
			}
			return monitoringParameters;
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
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
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

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
			if (response instanceof Array) {
				const tango = response.filter(ns => ns.platform.toLowerCase() === '5gtango')
					.map(item => ({
						uuid: item.uuid,
						name: item.nsd.name,
						vendor: item.nsd.vendor,
						version: item.nsd.version,
						status: item.status
					}));

				const osm = response.filter(ns => ns.platform.toLowerCase() === 'osm')
					.map(item => ({
						uuid: item.uuid,
						name: item.nsd[ 'nsd:nsd-catalog' ].nsd.name,
						vendor: item.nsd[ 'nsd:nsd-catalog' ].nsd.vendor,
						version: item.nsd[ 'nsd:nsd-catalog' ].nsd.version,
						status: item.status
					}));
				return tango.concat(osm);
			}
			return [];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Retrieves a Network Service by UUID
	 *
	 * @param uuid UUID of the desired Network Service.
	 */
	async getOneNetworkService(section, uuid: string) {
		const headers = this.authService.getAuthHeaders();
		const url = section === 'vnv' ?
			this.config.baseVNV + this.config.services + '/' + uuid :
			this.config.baseSP + this.config.services + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			if (response.hasOwnProperty('nsd') && response[ 'platform' ].toLowerCase() === '5gtango') {
				return {
					uuid: response[ 'uuid' ],
					platform: response[ 'platform' ],
					status: response[ 'status' ],
					updatedAt: response[ 'updated_at' ],
					createdAt: response[ 'created_at' ],
					author: response[ 'nsd' ][ 'author' ],
					name: response[ 'nsd' ][ 'name' ],
					vendor: response[ 'nsd' ][ 'vendor' ],
					version: response[ 'nsd' ][ 'version' ],
					description: response[ 'nsd' ][ 'description' ],
					vnf: response[ 'nsd' ][ 'network_functions' ] || []
				};
			} else if (response.hasOwnProperty('nsd') && response[ 'platform' ].toLowerCase() === 'osm') {
				const components = response[ 'nsd' ][ 'nsd:nsd-catalog' ][ 'nsd' ][ 'constituent-vnfd' ] ?
					response[ 'nsd' ][ 'nsd:nsd-catalog' ][ 'nsd' ][ 'constituent-vnfd' ].map(vnfd => ({
						vnf_id: vnfd[ 'member-vnf-index' ],
						vnf_name: vnfd[ 'vnfd-id-ref' ],
						vnf_vendor: '-',
						vnf_version: '-'
					})) : [];
				return {
					uuid: response[ 'uuid' ],
					platform: response[ 'platform' ],
					status: response[ 'status' ],
					updatedAt: response[ 'updated_at' ],
					createdAt: response[ 'created_at' ],
					author: response[ 'nsd' ][ 'nsd:nsd-catalog' ][ 'nsd' ][ 'author' ],
					name: response[ 'nsd' ][ 'nsd:nsd-catalog' ][ 'nsd' ][ 'name' ],
					vendor: response[ 'nsd' ][ 'nsd:nsd-catalog' ][ 'nsd' ][ 'vendor' ],
					version: response[ 'nsd' ][ 'nsd:nsd-catalog' ][ 'nsd' ][ 'version' ],
					description: response[ 'nsd' ][ 'nsd:nsd-catalog' ][ 'nsd' ][ 'description' ],
					vnf: components
				};
			} else {
				return { };
			}
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Retrieves the existing vims of type endpoint
	 */
	async getEndpoints() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.vimSettings;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.filter(item => item.type === 'endpoint').map(item => {
					return {
						uuid: item.uuid,
						name: item.name
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
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

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
				SNSSAI: this.parseSNSSAI(response[ 'nstd' ][ 'SNSSAI_identifier' ][ 'slice-service-type' ]),
				usageState: response[ 'nstd' ][ 'usageState' ],
				services: response[ 'nstd' ] ? response[ 'nstd' ][ 'slice_ns_subnets' ].map(item => {
					return {
						uuid: item[ 'id' ],
						nsdName: item[ 'nsd-name' ],
						nsdVendor: item[ 'nsd-vendor' ],
						nsdVersion: item[ 'nsd-version' ],
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
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	private parseSNSSAI(snssai) {
		switch (snssai) {
			case 'eMBB':
				return 'Enhanced Mobile Broadband slice (eMBB)';
			case 'URLLC':
				return 'Ultra Reliable Low Latency Communications slice (URLLC)';
			case 'mMTC':
				return 'Massive Machine Type Communications slice (mMTC)';
		}
	}

	async getSPDashboardData() {
		return {
			nstd: await this.getNSTDNumber() || this.unknown,
			nsd: await this.getNSDNumber() || this.unknown,
			vnfd: await this.getVNFDNumber() || this.unknown,
			rpd: await this.getRPDNumber() || this.unknown,
			slad: await this.getSLADNumber() || this.unknown,
			runningSlices: await this.getRunningSlices() || this.unknown,
			runningNS: await this.getRunningNS() || this.unknown,
			runningFunctions: await this.getRunningFunctions() || this.unknown,
			policyAlerts: await this.getPolicyAlertsNumber() || this.unknown
		};
	}

	async getVNVDashboardData() {
		const platforms = await this.getPlatformsNumber();

		return {
			testd: await this.getTDNumber() || this.unknown,
			nsd: await this.getNSDNumber() || this.unknown,
			vnfd: await this.getVNFDNumber() || this.unknown,
			sonataPlatforms: platforms[ 'SONATA' ] || this.unknown,
			osmPlatforms: platforms[ 'OSM' ] || this.unknown,
			onapPlatforms: platforms[ 'ONAP' ] || this.unknown,
			testsCompleted: await this.getTestsNumber('COMPLETED') || this.unknown,
			testsInProgress: await this.getTestsNumber('STARTING') || this.unknown,
			testsWaitingForConfirmation: await this.getTestsNumber('WAITING_FOR_CONFIRMATION') || this.unknown,
			testsScheduled: await this.getTestsNumber('SCHEDULED') || this.unknown,
			testsFailed: await this.getTestsNumber('ERROR') || this.unknown
		};
	}

	async getTDNumber() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.testDescriptors + `?count`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response[ 'count' ];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	async getNSTDNumber() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.slicesTemplates + `?count`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response[ 'count' ];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	async getVNFDNumber() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.base + this.config.functions + `?count`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response[ 'count' ];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	async getNSDNumber() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.base + this.config.services + `?count`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response[ 'count' ];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	async getRPDNumber() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.runtimePolicies + `/counter`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response.toString();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	async getSLADNumber() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.slaTemplates + `?count`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();

			return response[ 'count' ];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	async getRunningSlices() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.slicesInstances + `?count`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();

			return response[ 'count' ];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	async getRunningNS() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.serviceRecords + `?count`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();

			return response[ 'count' ];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	async getRunningFunctions() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.functionRecords + `?count`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();

			return response[ 'count' ];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	async getPolicyAlertsNumber() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseSP + this.config.runtimePoliciesActions + `/counter`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response.toString();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	async getPlatformsNumber() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.platformSettings + `/count`;

		try {
			return await this.http.get(url, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	async getTestsNumber(status) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.testPlans + `/count?status=${ status }`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response[ 'count' ].toString();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}
}
