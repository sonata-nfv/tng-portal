import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Config } from './config';

@Injectable()
export class ConfigService extends Config {
    baseSP: string = window.location.origin + '/api/v3/';
    baseVNV: string = window.location.origin + '/api/v3/';
    register = 'users/';
    login = 'sessions/';
    services = 'services';
    requests = 'requests';
    serviceRecords = 'records/services';
    functionRecords = 'records/functions';
    licenses = 'licenses/';
    packages = 'packages';
    slaTemplates = 'slas/templates';
    slaAgreements = 'slas/agreements';
    slaViolations = 'slas/violations';
    guarantees = 'slas/configurations/guaranteesList';
    functions = 'functions';
    slicesTemplates = 'slices';
    slicesInstances = 'slice-instances';
    tests = 'tests/descriptors';
    testExecute = 'tests/plans';
    testExecutions = 'tests/results';
    runtimePolicies = 'policies';
    runtimePoliciesBind = 'policies/bind/';
    runtimePoliciesDefault = 'policies/default/';
    runtimePoliciesActions = 'policies/actions';
    vimSettings = 'settings/vims';
    wimSettings = 'settings/wims';

    private configFile = './config.json';

    constructor(private http: HttpClient) {
        super();
    }

    init(): Promise<Config> {
        if (window.location.origin.includes('localhost')) {
            this.baseSP = 'http://pre-int-sp-ath.5gtango.eu:32002/api/v3/';
            this.baseVNV = 'http://pre-int-vnv-bcn.5gtango.eu:32002/api/v3/';
        }

        return new Promise<Config>((resolve, reject) => {
            this.http.get(this.configFile).subscribe(
                response => {
                    Object.assign(this, response as Config);
                    resolve(this);
                },
                (error: HttpErrorResponse) => {
                    reject(error.error);
                }
            );
        });
    }
}
