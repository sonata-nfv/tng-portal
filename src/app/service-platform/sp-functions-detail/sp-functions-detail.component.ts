import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServicePlatformService } from '../service-platform.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
    selector: 'app-sp-functions-detail',
    templateUrl: './sp-functions-detail.component.html',
    styleUrls: [ './sp-functions-detail.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SpFunctionsDetailComponent implements OnInit {
    loading: boolean;
    detail = {};

    constructor(
        private servicePlatformService: ServicePlatformService,
        private router: Router,
        private route: ActivatedRoute,
        private utilsService: UtilsService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const uuid = params[ 'id' ];
            this.requestFunction(uuid);
        });
    }

    /**
     * Generates the HTTP request of a function by UUID.
     *
     * @param uuid ID of the selected function to be displayed.
     *             Comming from the route.
     */
    requestFunction(uuid) {
        this.loading = true;

        this.servicePlatformService
            .getOneFunction(uuid)
            .then(response => {
                this.loading = false;
                this.detail = response;
            })
            .catch(err => {
                this.loading = false;
                this.utilsService.openSnackBar(err, '');
                this.close();
            });
    }

    close() {
        this.router.navigate([ 'service-platform/functions' ]);
    }
}
