import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from '../shared/services/config/config.service';
import { AuthService } from '../authentication/auth.service';
import { UtilsService } from '../shared/services/common/utils.service';

@Injectable()
export class ValidationAndVerificationPlatformService {
	authHeaders: HttpHeaders;
	request_uuid: string;
	// pagination: string = '?page_size=20&page_number=1';

	constructor(
		private authService: AuthService,
		private config: ConfigService,
		private http: HttpClient,
		private utilsService: UtilsService
	) { }

	/**
     * Retrieves a list of tests.
     * Either following a search pattern or not.
     *
     * @param search [Optional] Test attributes that must be
     *                          matched by the returned list of
     *                          tests.
     */
	async getTests(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search ?
			this.config.baseVNV + this.config.testDescriptors + search
			: this.config.baseVNV + this.config.testDescriptors;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						uuid: item.uuid,
						name: item.testd.name,
						vendor: item.testd.vendor,
						version: item.testd.version,
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
     * Retrieves a Test by UUID
     *
     * @param uuid UUID of the desired Test.
     */
	async getOneTest(uuid: string) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.testDescriptors + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return Object.keys(response).length ? {
				uuid: response[ 'uuid' ],
				name: response[ 'testd' ][ 'name' ],
				vendor: response[ 'testd' ][ 'vendor' ],
				version: response[ 'testd' ][ 'version' ],
				timesExecuted: response[ 'executions' ],
				author: response[ 'testd' ][ 'author' ],
				description: response[ 'testd' ][ 'description' ],
				createdAt: response[ 'created_at' ],
				updatedAt: response[ 'updated_at' ],
				status: response[ 'status' ],
				lastTimeExecuted: response[ 'last_time_executed' ]
			} : { };
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
     * Recovers the list of network services related to a test
     *
     * @param uuid UUID of the desired test
     */
	async getTestRelatedServices(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.testPlansTests + `/${ uuid }/services`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			if (response instanceof Array) {
				const tango = response.filter(ns => ns.platform.toLowerCase() === '5gtango')
					.map(item => {
						return {
							uuid: item.uuid,
							vendor: item.nsd.vendor,
							name: item.nsd.name,
							version: item.nsd.version
						};
					});

				const osm = response.filter(ns => ns.platform.toLowerCase() === 'osm')
					.map(item => {
						return {
							uuid: item.uuid,
							vendor: item.nsd[ 'nsd:nsd-catalog' ][ 'nsd' ].vendor,
							name: item.nsd[ 'nsd:nsd-catalog' ][ 'nsd' ].name,
							version: item.nsd[ 'nsd:nsd-catalog' ][ 'nsd' ].version
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
     * Recovers the results of a test execution
     *
     * @param uuid UUID of the desired test execution
     */
	async getTestResults(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.testExecutions + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return Object.keys(response).length ? {
				uuid: response[ 'uuid' ],
				details: response[ 'details' ],
				results: response[ 'results' ],
				status: response[ 'status' ],
				updatedAt: response[ 'updated_at' ],
				endedAt: response[ 'ended_at' ],
				startedAt: response[ 'started_at' ],
				serviceUUID: response[ 'service_uuid' ],
				testUUID: response[ 'test_uuid' ]
			} : { };
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
     * Retrieves a list of test plans.
     * Either following a search pattern or not.
     *
     * @param search [Optional] Test plan attributes that must be
     *                          matched by the returned list of
     *                          test plans.
     */
	async getTestPlans(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search ?
			this.config.baseVNV + this.config.testPlans + search
			: this.config.baseVNV + this.config.testPlans;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						uuid: item.uuid,
						testUUID: item.test_uuid,
						testName: item.test_name || 'Unknown',
						serviceUUID: item.service_uuid,
						serviceName: item.service_name || 'Unknown',
						status: item.test_status,
						required: item.confirm_required,
						updatedAt: item.updated_at
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
     * Retrieves a test plan by UUID
     *
     * @param uuid UUID of the desired test plan.
     */
	async getOneTestPlan(uuid: string) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.testPlans + '/' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return {
				uuid: response[ 'uuid' ],
				serviceUUID: response[ 'service_uuid' ],
				serviceName: response[ 'service_name' ] || 'Unknown',
				status: response[ 'test_status' ],
				required: response[ 'confirm_required' ],
				testSet: response[ 'test_set_uuid' ],
				testUUID: response[ 'test_uuid' ],
				testName: response[ 'test_name' ] || 'Unknown',
				testResultUuid: response[ 'test_result_uuid' ],
				updatedAt: response[ 'updated_at' ]
			};
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
     * Creates the test plans for a given test UUID
     *
     * @param uuid UUID of the desired test
	 * @param confirmRequired sets the created test plans with priority in the queue
     */
	async postTestPlans(section, uuid, confirmRequired) {
		const headers = this.authService.getAuthHeaders();
		const url = section === 'tests' ?
			this.config.baseVNV + this.config.testPlansTests + `?confirmRequired=${ confirmRequired }&testUuid=${ uuid }`
			: this.config.baseVNV + this.config.testPlansServices + `?confirmRequired=${ confirmRequired }&serviceUuid=${ uuid }`;

		try {
			return await this.http.post(url, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
     * Changes test plan status to be (re)executed to scheduled or to retried in case of a retrial
     *
     * @param uuid UUID of the desired test plan
	 * @param status new status to be set
     */
	async putNewTestPlanStatus(uuid, status) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.testPlans + `/${ uuid }?status=${ status }`;

		try {
			return await this.http.put(url, { headers: headers }).toPromise();
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
     * Cancels a test plan scheduled for execution
     *
     * @param uuid UUID of the desired test plan
     */
	async deleteTestPlan(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.testPlans + `/${ uuid }`;

		try {
			await this.http.delete(url, { headers: headers }).toPromise();
			return uuid;
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Obtains the analytic results available to the moment.
	 *
	 * @param search [Optional] Attributes that must be
     *                          matched by the returned list of
     *                          results.
	 */
	async getAnalyticResults(search?) {
		const headers = this.authService.getAuthHeaders();
		const url = search ?
			this.config.baseVNV + this.config.analyticResultList + search
			: this.config.baseVNV + this.config.analyticResultList;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						uuid: item.id,
						name: item.analyticProcessFriendlyName,
						test: item.metadata.test_uuid,
						testResult: item.metadata.testr_uuid,
						serviceName: item.analyticServiceName,
						status: item.status,
						executionDate: item.executionDate
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
	 * Obtain the information relative to one analytic result
	 *
	 * @param id Identifier of the analytic result selected
	 */
	async getAnalyticResult(id) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.analyticResultList + `?result_id=${ id }`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Object ?
				{
					'analyticProcessFriendlyName': response[ 'analyticProcessFriendlyName' ],
					'id': response[ 'id' ],
					'analyticServiceName': response[ 'analyticServiceName' ],
					'status': response[ 'status' ],
					'testUUID': response[ 'metadata' ][ 'test_uuid' ],
					'testResultUUID': response[ 'metadata' ][ 'testr_uuid' ],
					'executedAt': response[ 'executionDate' ],
					'executionMessage': response[ 'executionMessage' ],
					'htmlResult': response[ 'results' ] && response[ 'results' ].length ?
						response[ 'results' ].find(item => item.type === 'html')[ 'result' ] : '',
					'otherResults': response[ 'results' ] && response[ 'results' ].length ?
						response[ 'results' ].filter(item => item.type !== 'html') : []
				} : { };
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Remove the analytic result from database
	 *
	 * @param uuid Unique identifier of the analytic result
	 */
	async deleteAnalyticResult(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.analyticsResult + uuid;

		try {
			const response = await this.http.delete(url, { headers: headers }).toPromise();
			return response;
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Obtain all the tests executed to the moment
	 */
	async getAllTestResults() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.testExecutions;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						uuid: item.uuid,
						name: item.uuid,
						instanceUUID: item.instance_uuid
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
	 * Obtain all the services provided by the analytics engine
	 */
	async getAnalyticServices() {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.analyticServices;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ? response : [];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Obtain all the monitoring metrics from a network service instance tested
	 *
	 * @param nsr_uuid UUID of the network service instance tested
	 */
	async getMonitoringMetrics(nsr_uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.analyticMonitoringMetrics + `${ nsr_uuid }/metrics`;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return (response && response[ 'data' ] instanceof Array) ?
				response[ 'data' ] : [];
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}

	/**
	 * Generates an analytic process and runs it
	 *
	 * @param processObj Object describing the analytic process to be run
	 */
	async postAnalyticProcess(processObj) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.analyticProcessExecution;

		try {
			await this.http.post(url, processObj, { headers: headers }).toPromise();
			return processObj.name;
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}

			console.error(error);
		}
	}
}

