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
	getTests(search?): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();
			const url =
				search !== undefined
					? this.config.baseVNV + this.config.tests + search
					: this.config.baseVNV + this.config.tests;

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
									name: item.testd.name,
									vendor: item.testd.vendor,
									version: item.testd.version,
									status: this.utilsService.capitalizeFirstLetter(item.status)
								};
							})
						);
					} else {
						reject('There was an error while fetching the tests');
					}
				})
				.catch(err => reject('There was an error while fetching the tests'));
		});
	}

	/**
     * Retrieves a Test by UUID
     *
     * @param uuid UUID of the desired Test.
     */
	getOneTest(uuid: string) {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			this.http
				.get(this.config.baseVNV + this.config.tests + '/' + uuid, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					resolve({
						uuid: response[ 'uuid' ],
						name: response[ 'testd' ][ 'name' ],
						vendor: response[ 'testd' ][ 'vendor' ],
						version: response[ 'testd' ][ 'version' ],
						timesExecuted: response[ 'executions' ],
						author: response[ 'testd' ][ 'author' ],
						description: response[ 'testd' ][ 'description' ],
						createdAt: this.utilsService.formatUTCDate(response[ 'created_at' ]),
						updatedAt: this.utilsService.formatUTCDate(response[ 'updated_at' ]),
						status: this.utilsService.capitalizeFirstLetter(response[ 'status' ]),
						lastTimeExecuted: this.utilsService.formatUTCDate(
							response[ 'last_time_executed' ]
						)
						// services: response['testd']
					});
				})
				.catch(err => reject('There was an error while fetching the test'));
		});
	}

	/**
     * Launches a test or the test's of a service by UUID
     *
     * @param type Type of tests being launched: a test itself [test]
     *                   or the tests related to a service [service]
     * @param uuid UUID of the desired Test or Service
     */
	postOneTest(type: string, uuid: string) {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			let data;
			if (type === 'test') {
				data = {
					test_uuid: uuid
				};
			} else if (type === 'service') {
				data = {
					service_uuid: uuid
				};
			} else {
				reject('There was an error while trying to execute the tests');
			}

			this.http
				.post(this.config.baseVNV + this.config.testExecute, data, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					resolve(response);
				})
				.catch(err => reject('There was an error executing the test!'));
		});
	}

	/**
     * Recovers the list of test executions for a test
     *
     * @param uuid UUID of the desired test
     */
	getTestExecutions(uuid): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			const url =
				this.config.baseVNV + this.config.testExecutions + '?test_uuid=' + uuid;

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
									serviceUUID: item.service_uuid,
									createdAt: this.utilsService.formatDateString(item.created_at),
									testUUID: item.test_uuid,
									status: this.utilsService.capitalizeFirstLetter(item.status)
								};
							})
						);
					} else {
						resolve([]);
					}
				})
				.catch(err => resolve([]));
		});
	}

	/**
     * Recovers the results of a test execution
     *
     * @param uuid UUID of the desired test execution
     */
	getTestResults(uuid): any {
		return new Promise((resolve, reject) => {
			const headers = this.authService.getAuthHeaders();

			const url = this.config.baseVNV + this.config.testExecutions + '/' + uuid;

			this.http
				.get(url, {
					headers: headers
				})
				.toPromise()
				.then(response => {
					resolve({
						uuid: response[ 'uuid' ],
						status: this.utilsService.capitalizeFirstLetter(response[ 'status' ]),
						startedAt: this.utilsService.formatUTCDate(response[ 'started_at' ]),
						results: response[ 'results' ],
						sterr: response[ 'sterr' ],
						details: response[ 'details' ]
							? response[ 'details' ][ 'details' ]
							: null,
						graphs: response[ 'details' ] ? response[ 'details' ][ 'graphs' ] : null
					});
				})
				.catch(err =>
					reject('There was an error while fetching the test execution results')
				);
		});
	}
}
