import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
    selector: 'app-sla-templates-detail',
    templateUrl: './sla-templates-detail.component.html',
    styleUrls: [ './sla-templates-detail.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SlaTemplatesDetailComponent implements OnInit {
    loading: boolean;
    detail = {};
    templateForm: FormGroup;
    closed = false;
    listNS = new Array();
    closedSLO: Array<Boolean> = new Array();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private servicePlatformService: ServicePlatformService,
        private utilsService: UtilsService
    ) { }

    ngOnInit() {
        this.templateForm = new FormGroup({
            ns: new FormControl(),
            guarantee: new FormControl()
        });

        this.route.params.subscribe(params => {
            const uuid = params[ 'id' ];
            this.requestSLATemplate(uuid);
        });
    }

    /**
     * Generates the HTTP request of a SLA Template by UUID.
     *
     * @param uuid ID of the selected template to be displayed.
     *             Comming from the route.
     */
    requestSLATemplate(uuid) {
        this.loading = true;

        this.servicePlatformService
            .getOneSLATemplate(uuid)
            .then(response => {
                this.loading = false;
                this.detail = response;
                this.listNS = [ response.ns ];
                this.templateForm.controls.ns.setValue(response.ns);
            })
            .catch(err => {
                this.loading = false;
                this.utilsService.openSnackBar(err, '');
                this.close();
            });
    }

    receiveNS($event) { }

    receiveGuarantee($event) { }

    receiveDate($event) { }

    deleteTemplate() {
        this.loading = true;

        this.servicePlatformService
            .deleteOneSLATemplate(this.detail[ 'uuid' ])
            .then(response => {
                this.loading = false;
                this.utilsService.openSnackBar('Template deleted', '');
                this.close();
            })
            .catch(err => {
                this.loading = false;
                this.utilsService.openSnackBar(err, '');
                this.close();
            });
    }

    close() {
        this.router.navigate([ 'service-platform/slas/sla-templates' ]);
    }
}
