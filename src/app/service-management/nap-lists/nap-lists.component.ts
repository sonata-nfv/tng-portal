import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';
import { LocationNap } from './location-nap';

@Component({
	selector: 'app-nap-lists',
	templateUrl: './nap-lists.component.html',
	styleUrls: [ './nap-lists.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class NapListsComponent implements OnInit {
	loading: boolean;
	listName = 'ingress';
	napForm: FormGroup;
	locations: Array<any>;

	@Input() activateBlacklist: boolean;
	@Input() ingress: Array<LocationNap>;
	@Input() egress: Array<LocationNap>;
	@Input() blacklist: Array<LocationNap>;
	@Input()
	set resetForm(resetForm: boolean) {
		if (resetForm) {
			this.napForm.reset();
		}
	}

	@Output() listEvent = new EventEmitter<{
		listName: string,
		list: Array<LocationNap>
	}>();

	constructor(
		private utilsService: UtilsService,
		private commonService: CommonService
	) { }

	ngOnInit() {
		this.napForm = new FormGroup({
			location: new FormControl(),
			nap: new FormControl(null, Validators.pattern(this.utilsService.getIpAndMaskPattern()))
		});

		this.getLocations();
	}

	async getLocations() {
		this.loading = true;
		const endpoints = await this.commonService.getEndpoints();

		this.loading = false;
		if (endpoints) {
			this.locations = endpoints;
			this.locations.unshift({ uuid: 'None', name: 'None' });
		} else {
			this.utilsService.openSnackBar('Unable to fetch locations', '');
		}
	}

	addNew() {
		const point = {
			location: this.napForm.get('location').value,
			locationName: this.locations.find(location => location.uuid === this.napForm.get('location').value).name,
			nap: this.napForm.get('nap').value
		};

		switch (this.listName) {
			case 'ingress':
				this.ingress.push(point);
				this.fireListEvent(this.ingress);
				break;
			case 'egress':
				this.egress.push(point);
				this.fireListEvent(this.egress);
				break;
			case 'blacklist':
				this.blacklist.push(point);
				this.fireListEvent(this.blacklist);
				break;
		}

		this.napForm.reset();
	}

	eraseEntry(entry) {
		switch (this.listName) {
			case 'ingress':
				this.ingress = this.ingress.filter(x => x !== entry);
				this.fireListEvent(this.ingress);
				break;
			case 'egress':
				this.egress = this.egress.filter(x => x !== entry);
				this.fireListEvent(this.egress);
				break;
			case 'blacklist':
				this.blacklist = this.blacklist.filter(x => x !== entry);
				this.fireListEvent(this.blacklist);
				break;
		}
	}

	setListName(listName) {
		this.listName = listName;
	}

	receiveLocation(location) {
		location ?
			this.napForm.get('location').setValue(location) :
			this.napForm.get('location').setValue(null);
	}

	canShowForm() {
		return this.locations && this.locations.length;
	}

	canShowNoLocationsError() {
		return !this.loading && !this.canShowForm();
	}

	canShowNetworkAddress() {
		return this.napForm.get('location').value && this.napForm.get('location').value !== 'None' ? true : false;
	}

	canResetSelect() {
		return this.napForm.get('location').value ? false : true;
	}

	canDisableAddNew() {
		return !this.napForm.get('location').value ||
			!this.napForm.get('nap').value ||
			this.napForm.get('nap').errors;
	}

	fireListEvent(list) {
		this.listEvent.emit({ listName: this.listName, list: list });
	}
}
