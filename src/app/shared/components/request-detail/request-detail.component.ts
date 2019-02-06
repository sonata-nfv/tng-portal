import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../services/common/common.service';

@Component({
    selector: 'app-request-detail',
    templateUrl: './request-detail.component.html',
    styleUrls: [ './request-detail.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class RequestDetailComponent implements OnInit {
    loading: boolean;
    detail = {};

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const uuid = params[ 'id' ];
            this.requestRequest(uuid);
        });
    }

    /**
     * Generates the HTTP request of a defined NS request by UUID.
     *
     * @param uuid ID of the selected NS request to be displayed.
     *             Comming from the route.
     */
    requestRequest(uuid) {
        this.loading = true;

        this.commonService
            .getOneNSRequest(uuid)
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
        this.router.navigate([ '../' ], { relativeTo: this.route });
    }
}
