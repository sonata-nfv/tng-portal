import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from '../shared/services/config/config.service';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class DashboardService {
	authHeaders: HttpHeaders;

	constructor(
		private authService: AuthService,
		private config: ConfigService,
		private http: HttpClient
	) { }

	/**
	 * Retrieves the VIM UUID required to build the graphs URL
	 *
	 * @param metric One metric name to get the VIM UUID from Prometheus metrics information
	 *
	 */
	async getVimUuid(metric) {
		const headers = this.authService.getAuthHeaders();
		const url = this.config.base + this.config.monitoringMetricsByName + metric;

		try {
			const response = await this.http.get(url, { headers: headers }).toPromise();
			if (response[ 'metrics' ][ 'result' ] instanceof Array) {
				const resultingMetric = response[ 'metrics' ][ 'result' ].find(item => {
					const location = item.metric.exported_instance.split(':')[ 0 ];
					const metricName = item.metric.__name__;
					if (this.config.base.includes(location) && metricName === metric) {
						return item;
					}
				})[ 'metric' ];
				return resultingMetric ?
					{ vimUUID: resultingMetric[ 'resource_id' ], vimEnv: resultingMetric[ 'exported_instance' ] }
					: { };
			} else {
				return { };
			}
		} catch (error) {
			console.error(error);
		}
	}
}
