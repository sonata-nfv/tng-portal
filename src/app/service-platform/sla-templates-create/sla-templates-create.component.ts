import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { ServicePlatformService } from '../service-platform.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';
import { UtilsService } from '../../shared/services/common/utils.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
    selector: 'app-sla-templates-create',
    templateUrl: './sla-templates-create.component.html',
    styleUrls: [ './sla-templates-create.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SlaTemplatesCreateComponent implements OnInit {
    loading: boolean;
    section: string;
    closed = false;
    closedSLO: Array<Boolean> = new Array();
    reset = false;
    disabledButton = true;
    templateForm: FormGroup;
    nsList = new Array();
    storedGuarantees = new Array();
    guaranteesList = new Array();
    guaranties = new Array();
    nss = new Array();

    constructor(
        private router: Router,
        private utilsService: UtilsService,
        private commonService: CommonService,
        private servicePlatformService: ServicePlatformService,
        private dialogData: DialogDataService
    ) { }

    ngOnInit() {
        this.section = 'SP';
        this.templateForm = new FormGroup({
            name: new FormControl(),
            ns: new FormControl(),
            expirationDate: new FormControl()
        });

        this.templateForm.valueChanges.subscribe(value => this._onFormChanges(value));

        this.loading = true;
        Promise.all([ this.commonService.getNetworkServices(this.section), this.servicePlatformService.getServiceGuarantees() ])
            .then(responses => {
                this.loading = false;

                if (responses[ 0 ].length < 1 || responses[ 1 ].length < 1) {
                    throw new Error('No network services');
                }

                // Save guarantees and NS data to display
                this.nsList = responses[ 0 ].map(x => x.name);

                // Create a list of guarantees to display in the select
                this.guaranteesList = responses[ 1 ].map(x => x.guaranteeID + ' - ' + x.name + ': ' + x.value + ' ' + x.unit);

                // Save complete data from guarantees and NS
                this.nss = responses[ 0 ];
                this.guaranties = responses[ 1 ];
            })
            .catch(err => {
                this.loading = false;
                const title = 'oh oh...';
                const content = 'Unable to create any template without network services and guarantees!';
                const action = 'Accept';
                this.dialogData.openDialog(title, content, action, () => { });
                this.close();
            });
    }

    // TODO on form changes check there's ns, expiration date and some guarantees and then activate save
    private _onFormChanges(value?) {
        if (
            this.templateForm.controls.ns.value != null &&
            this.templateForm.controls.name.value != null &&
            this.templateForm.controls.expirationDate.value != null &&
            this.storedGuarantees.length > 0
        ) {
            this.disabledButton = false;
        } else {
            this.disabledButton = true;
        }
    }

    receiveNS(ns) {
        this.templateForm.controls.ns.setValue(ns);
    }

    receiveDate(expirationDate) {
        this.templateForm.controls.expirationDate.setValue(expirationDate);
    }

    createSlaTemplate() {
        this.loading = true;

        const guarantees = this.storedGuarantees.map(x => x.guaranteeID);
        const nsd_uuid = this.nss.find(x => x.name === this.templateForm.controls.ns.value).serviceId;
        const expireDate = this.templateForm.controls.expirationDate.value;

        const template = {
            templateName: this.templateForm.controls.name.value,
            nsd_uuid,
            expireDate,
            guaranteeId: guarantees
        };

        this.servicePlatformService
            .postOneSLATemplate(template)
            .then(response => {
                this.loading = false;
                this.utilsService.openSnackBar('Template successfully created!', '');
                this.close();
            })
            .catch(err => {
                this.loading = false;
                const title = 'oh oh...';
                const action = 'Accept';

                if (err.error[ 'ERROR: ' ] === 'Conflict') {
                    const content = 'This template name is already taken!';
                    this.dialogData.openDialog(title, content, action, () => { });
                } else if (err.error[ 'ERROR: ' ] === 'The expire date is not a future date.') {
                    const content = 'The expire date is not a future date. Please choose another.';
                    this.dialogData.openDialog(title, content, action, () => { });
                } else {
                    this.utilsService.openSnackBar('There was an error in the template creation', '');
                }
            });
    }

    addGuarantee(guarantee) {
        if (guarantee != null) {
            const id = guarantee.split(' - ')[ 0 ];
            const prop = guarantee.split(' - ')[ 1 ].split(': ')[ 0 ];

            // Include the selected guarantee in the displayed list
            this.storedGuarantees.push(this.guaranties.find(x => x.guaranteeID === id));

            // Enable opening only the selected SLO
            this.closedSLO.push(false);

            // Remove the selected guarantee from the guarantees list offered
            this.guaranteesList = this.guaranteesList.filter(x => x.split(' - ')[ 0 ] !== id);

            // Remove other guarantees with same goals
            this.guaranteesList = this.guaranteesList.filter(x => x.split(' - ')[ 1 ].split(': ')[ 0 ] !== prop);

            this._onFormChanges();

            this.reset = true;
            setTimeout(() => {
                this.reset = false;
            }, 5);
        }
    }

    eraseEntry(item) {
        // Remove item from the list of stored guarantees displayed
        this.storedGuarantees = this.storedGuarantees.filter(x => x.guaranteeID !== item.guaranteeID);
        // Save all items with that property in the offered guarantees
        this.guaranteesList = this.guaranteesList.concat(
            this.guaranties.filter(x => x.name === item.name).map(x => x.guaranteeID + ' - ' + x.name + ': ' + x.value + ' ' + x.unit)
        );

        this._onFormChanges();
    }

    close() {
        this.router.navigate([ 'service-platform/slas/sla-templates' ]);
    }
}
