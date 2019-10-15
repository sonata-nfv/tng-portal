import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
	selector: 'app-scale-out',
	templateUrl: './scale-out.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ScaleOutComponent implements OnInit {
	scaleOutForm: FormGroup;
	@Input() list: Array<object>;
	@Output() scaleOutEvent = new EventEmitter<{
		instance_uuid: string,
		request_type: string,
		scaling_type: string,
		vnfd_uuid: string,
		number_of_instances: string
	}>();

	constructor(private utilsService: UtilsService) { }

	ngOnInit() {
		this.scaleOutForm = new FormGroup({
			numberOfInstances: new FormControl('1', [ Validators.required, Validators.pattern(this.utilsService.getNumberPattern()) ]),
			instanceUUID: new FormControl('', Validators.required),
			vnfdUUID: new FormControl('', Validators.required)
		});
	}

	receiveFunction(value) {
		const vnfdUUID = this.list.find(item => item[ 'uuid' ] === value)[ 'descriptorRef' ];
		this.scaleOutForm.get('instanceUUID').setValue(value);
		this.scaleOutForm.get('vnfdUUID').setValue(vnfdUUID);
	}

	scaleOut() {
		this.scaleOutEvent.emit({
			'instance_uuid': this.scaleOutForm.get('instanceUUID').value,
			'request_type': 'SCALE_SERVICE',
			'scaling_type': 'ADD_VNF',
			'vnfd_uuid': this.scaleOutForm.get('vnfdUUID').value,
			'number_of_instances': this.scaleOutForm.get('numberOfInstances').value
		});
	}
}
