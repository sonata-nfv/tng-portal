import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { CommonService } from '../../shared/services/common/common.service';
import { ServicePlatformService } from '../service-platform.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';

@Component({
    selector: 'app-slices-templates-create',
    templateUrl: './slices-templates-create.component.html',
    styleUrls: [ './slices-templates-create.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SlicesTemplatesCreateComponent implements OnInit {
    loading: boolean;
    section: string;
    reset = false;
    disabledButton = true;
    templateForm: FormGroup;
    nsList = new Array();
    nsListComplete = new Array();
    slaList = new Array();
    slaListComplete = new Array();
    storedNS = new Array();
    nsObj: Object;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dialogData: DialogDataService,
        private commonService: CommonService,
        private servicePlatformService: ServicePlatformService
    ) { }

    ngOnInit() {
        this.section = 'SP';
        this.templateForm = new FormGroup({
            name: new FormControl(),
            vendor: new FormControl(),
            version: new FormControl(),
            author: new FormControl()
        });

        this.templateForm.valueChanges.subscribe(value =>
            this._onFormChanges(value)
        );

        this.loading = true;
        this.commonService
            .getNetworkServices(this.section)
            .then(response => {
                this.loading = false;

                if (response.length < 1) {
                    throw new Error('No network services');
                }

                this.nsList = response.map(
                    x => x.vendor + ': ' + x.name + ' - v' + x.version
                );

                this.nsListComplete = response;
                this.commonService
                    .getSLATemplates()
                    .then(res => {
                        this.slaListComplete = response;
                    })
                    .catch(err => {
                        this.commonService.openSnackBar(err, '');
                    });
            })
            .catch(err => {
                this.loading = false;
                const title = 'oh oh...';
                const content = 'Unable to create any slice without network services!';
                const action = 'Accept';
                this.dialogData.openDialog(title, content, action, () => { });
                this.close();
            });
    }

    private _onFormChanges(values) {
        this.disabledButton =
            this.templateForm.valid && this.storedNS.length > 0 ? false : true;
    }

    receiveNS(ns) {
        if (ns != null) {
            this.nsObj = {
                vendor: ns.split(': ')[ 0 ],
                name: ns.split(': ')[ 1 ].split(' - v')[ 0 ],
                version: ns.split(': ')[ 1 ].split(' - v')[ 1 ]
            };

            this.nsObj[ 'uuid' ] = this.nsListComplete.find(
                x =>
                    x.vendor === this.nsObj[ 'vendor' ] &&
                    x.name === this.nsObj[ 'name' ] &&
                    x.version === this.nsObj[ 'version' ]
            ).serviceId;

            // Filter when ns selected
            this.slaList = this.slaListComplete
                .filter(x => x.nsUUID === this.nsObj[ 'uuid' ])
                .map(x => x.name);

            this.slaList.unshift('None');
        }
    }

    receiveSLA(sla) {
        if (sla != null) {
            const slaObj =
                sla !== 'None' ? this.slaListComplete.find(x => x.name === sla) : null;

            this.nsObj[ 'sla' ] = slaObj ? slaObj.name : 'None';
            this.nsObj[ 'slaUUID' ] = slaObj ? slaObj.uuid : null;

            this.storedNS.push(Object.assign({}, this.nsObj));
            this._onFormChanges(null);

            this.nsObj = null;
            this.reset = true;
            setTimeout(() => {
                this.reset = false;
            }, 5);
        }
    }

    eraseEntry(index) {
        this.storedNS.splice(index, 1);
        this._onFormChanges(null);
    }

    createSliceTemplate() {
        const template = {
            name: this.templateForm.get('name').value,
            vendor: this.templateForm.get('vendor').value,
            version: this.templateForm.get('version').value,
            author: this.templateForm.get('author').value,
            sliceServices: this.storedNS.map(x => {
                return { servname: x.name, nsdID: x.uuid, slaID: x.slaUUID };
            })
        };

        this.loading = true;
        this.servicePlatformService
            .postOneSliceTemplate(template)
            .then(response => {
                this.loading = false;
                this.commonService.openSnackBar('Template successfully created!', '');
                this.close();
            })
            .catch(err => {
                this.loading = false;
                this.commonService.openSnackBar(
                    'There was an error in the template creation',
                    ''
                );
            });
    }

    close() {
        this.router.navigate([ 'service-platform/slices/slices-templates' ]);
    }
}
