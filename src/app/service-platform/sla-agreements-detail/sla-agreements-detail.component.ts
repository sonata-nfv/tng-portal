import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { ServicePlatformService } from '../service-platform.service';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
    selector: 'app-sla-agreements-detail',
    templateUrl: './sla-agreements-detail.component.html',
    styleUrls: [ './sla-agreements-detail.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SlaAgreementsDetailComponent implements OnInit {
    loading: boolean;
    agreementForm: FormGroup;
    detail = {};

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private servicePlatformService: ServicePlatformService,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const sla_uuid = params[ 'id_sla' ];
            const ns_uuid = params[ 'id_ns' ];
            this.requestSLAAgreement(sla_uuid, ns_uuid);
        });
    }

    /**
     * Generates the HTTP request of a SLA Agreement by UUID.
     *
     * @param uuid ID of the selected agreement to be displayed.
     *             Comming from the route.
     */
    requestSLAAgreement(sla_uuid, ns_uuid) {
        this.loading = true;

        this.servicePlatformService
            .getOneSLAAgreement(sla_uuid, ns_uuid)
            .then(response => {
                this.loading = false;
                this.detail = response;
            })
            .catch(err => {
                this.loading = false;
                this.commonService.openSnackBar(err, '');
                this.close();
            });
    }

    close() {
        this.router.navigate([ 'service-platform/slas/sla-agreements' ]);
    }
}
