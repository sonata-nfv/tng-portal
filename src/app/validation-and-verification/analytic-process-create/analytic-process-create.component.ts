import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';

@Component({
	selector: 'app-analytic-process-create',
	templateUrl: './analytic-process-create.component.html',
	styleUrls: [ './analytic-process-create.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class AnalyticProcessCreateComponent implements OnInit {
	loading = false;
	analyticProcessForm: FormGroup;
	tests: Array<object>;
	services: Array<object>;
	monitoringMetrics: Array<string>;
	stepUnits: Array<object>;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private utilsService: UtilsService,
		private dialogData: DialogDataService,
		private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
	) { }

	ngOnInit() {
		this.initForm();
		this.getRequiredData();
		this.stepUnits = this.utilsService.getDurationUnits();
	}

	private initForm() {
		this.analyticProcessForm = new FormGroup({
			name: new FormControl('', Validators.required),
			test: new FormControl('', Validators.required),
			service: new FormControl('', Validators.required),
			step: new FormControl(),
			stepUnit: new FormControl(),
			monitoringMetrics: new FormControl()
		});

		this.controlStepValidity();
	}

	private controlStepValidity() {
		this.analyticProcessForm.get('step').valueChanges
			.subscribe(stepValue => {
				if (stepValue) {
					this.analyticProcessForm.get('step').setValidators(Validators.pattern(this.utilsService.getNumberPattern()));
					this.analyticProcessForm.get('stepUnit').setValidators(Validators.required);
				} else {
					this.analyticProcessForm.get('step').setValidators(null);
					this.analyticProcessForm.get('stepUnit').setValidators(null);
					this.analyticProcessForm.get('stepUnit').setValue(null);
				}

				this.analyticProcessForm.get('step').updateValueAndValidity({ onlySelf: false, emitEvent: false });
				this.analyticProcessForm.get('stepUnit').updateValueAndValidity({ onlySelf: false, emitEvent: false });
			});
	}

	private async getRequiredData() {
		this.loading = true;
		const tests = await this.verificationAndValidationPlatformService.getAllTestResults();
		const services = await this.verificationAndValidationPlatformService.getAnalyticServices();

		this.loading = false;
		if (tests && tests.length && services && services.length) {
			this.tests = tests;
			this.services = services;
		} else {
			const title = 'oh oh...';
			const content = 'There was an error fetching the information required to create an analytic process. Please, try again later.';
			const action = 'Accept';

			this.dialogData.openDialog(title, content, action, () => {
				this.close();
			});
		}
	}

	private async getMonitoringMetrics(nsr_uuid) {
		this.loading = true;
		this.monitoringMetrics = new Array<string>();
		const monitoringMetrics = await this.verificationAndValidationPlatformService.getMonitoringMetrics(nsr_uuid);

		this.loading = false;
		(monitoringMetrics && monitoringMetrics.length) ?
			this.monitoringMetrics = monitoringMetrics
			: this.utilsService.openSnackBar('Unable to fetch any monitoring metric for this test execution', '');
	}

	canDisableSave() {
		return this.analyticProcessForm.invalid;
	}

	receiveTest(uuid) {
		const instanceUUID = this.tests.find(test => test[ 'uuid' ] === uuid)[ 'instanceUUID' ];
		this.analyticProcessForm.get('test').setValue(uuid);
		this.getMonitoringMetrics(instanceUUID);
	}

	receiveService(uuid) {
		const serviceName = this.services.find(service => service[ 'id' ] === uuid)[ 'name' ];
		this.analyticProcessForm.get('service').setValue(serviceName);
	}

	receiveStepUnit(unit) {
		this.analyticProcessForm.get('stepUnit').setValue(unit);
	}

	canShowForm() {
		return this.services && this.services.length && this.tests && this.tests.length;
	}

	canShowMonitoringMetricsSelect() {
		return this.monitoringMetrics && this.monitoringMetrics.length;
	}

	manageMonitoringMetricsList(metric) {
		let monitoringMetrics = this.analyticProcessForm.get('monitoringMetrics').value || [];
		monitoringMetrics.indexOf(metric) > -1 ?
			monitoringMetrics = monitoringMetrics.filter(item => item !== metric)
			: monitoringMetrics.push(metric);

		this.analyticProcessForm.get('monitoringMetrics').setValue(monitoringMetrics);
	}

	async createAnalyticProcess() {
		this.loading = true;
		const processObj = {
			'process_friendly_name': this.analyticProcessForm.get('name').value,
			'name': this.analyticProcessForm.get('service').value,
			'vendor': '5gtango.vnv',
			'testr_uuid': this.analyticProcessForm.get('test').value
		};

		const monitoringMetrics = this.analyticProcessForm.get('monitoringMetrics').value;
		if (monitoringMetrics && monitoringMetrics.length) {
			processObj[ 'metrics' ] = monitoringMetrics;
		}

		const step = this.analyticProcessForm.get('step').value;
		const stepUnit = this.analyticProcessForm.get('stepUnit').value;
		if (step && stepUnit) {
			processObj[ 'step' ] = step.concat(stepUnit);
		}

		const response = await this.verificationAndValidationPlatformService.postAnalyticProcess(processObj);

		this.loading = false;
		if (response) {
			this.utilsService.openSnackBar(`Starting the analytic process ${ response }...`, '');
			this.close();
		} else {
			this.utilsService.openSnackBar('Unable to run the analytic process', '');
		}
	}

	close() {
		this.router.navigate([ '../' ], { relativeTo: this.route });
	}
}
