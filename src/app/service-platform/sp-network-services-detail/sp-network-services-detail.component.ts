import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
    selector: 'app-sp-network-services-detail',
    templateUrl: './sp-network-services-detail.component.html',
    styleUrls: [ './sp-network-services-detail.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class SpNetworkServicesDetailComponent implements OnInit {
    loading: boolean;
    detail = {};
    displayedColumns = [ 'id', 'name', 'vendor', 'version' ];

    constructor(
        private commonService: CommonService,
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const uuid = params[ 'id' ];
            this.requestNetworkService(uuid);
        });
    }

    requestNetworkService(uuid) {
        this.loading = true;

        this.commonService
            .getOneNetworkService('sp', uuid)
            .then(response => {
                this.loading = false;
                this.detail = response;

                if (this.detail[ 'vnf' ].lenght < 1) {
                    this.detail[ 'vnf' ] = [];
                }
            })
            .catch(err => {
                this.loading = false;
                this.utilsService.openSnackBar(err, '');
                this.close();
            });
    }

    close() {
        this.router.navigate([ '../' ], { relativeTo: this.route });
    }
}
