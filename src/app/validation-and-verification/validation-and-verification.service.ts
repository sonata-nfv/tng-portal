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
			this.config.baseVNV + this.config.tests + search
			: this.config.baseVNV + this.config.tests;

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
		const url = this.config.baseVNV + this.config.tests + '/' + uuid;

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
     * Recovers the list of test executions for a test
     *
     * @param uuid UUID of the desired test
     */
	async getTestExecutions(uuid) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.baseVNV + this.config.testExecutions + '?test_uuid=' + uuid;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			return response instanceof Array ?
				response.map(item => {
					return {
						uuid: item.uuid,
						serviceUUID: item.service_uuid,
						createdAt: item.created_at,
						testUUID: item.test_uuid,
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
						serviceUUID: item.service_uuid,
						status: item.test_status,
						required: item.confirm_required
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
				status: response[ 'test_status' ],
				required: response[ 'confirm_required' ],
				testSet: response[ 'test_set_uuid' ],
				testUUID: response[ 'test_uuid' ],
				updatedAt: response[ 'updated_at' ]
			};
		} catch (error) {
			if (error.status === 401 && error.statusText === 'Unauthorized') {
				this.utilsService.launchUnauthorizedError();
			}
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
}
