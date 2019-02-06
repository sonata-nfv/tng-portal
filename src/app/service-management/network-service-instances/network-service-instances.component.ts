import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';

import { ServiceManagementService } from '../service-management.service';
import { CommonService } from '../../shared/services/common/common.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';

@Component({
    selector: 'app-network-service-instances',
    templateUrl: './network-service-instances.component.html',
    styleUrls: [ './network-service-instances.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class NetworkServiceInstancesComponent implements OnInit, OnDestroy {
    loading: boolean;
    searchText: string;
    instances: Array<Object>;
    dataSource = new MatTableDataSource();
    subscription: Subscription;
    displayedColumns = [
        'name',
        'status',
        'version',
        'createdAt',
        // 'reload',
        'stop'
    ];

    constructor(
        private serviceManagementService: ServiceManagementService,
        private router: Router,
        private commonService: CommonService,
        private route: ActivatedRoute,
        private dialogData: DialogDataService
    ) { }

    ngOnInit() {
        this.requestNSInstances();

        // Reloads the template list every when children are closed
        this.subscription = this.router.events.subscribe(event => {
            if (
                event instanceof NavigationEnd &&
                event.url === '/service-management/network-service-instances' &&
                this.route.url[ 'value' ].length === 2 &&
                this.route.url[ 'value' ][ 1 ].path === 'network-service-instances'
            ) {
                this.requestNSInstances();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    searchFieldData(search) {
        this.requestNSInstances(search);
    }

    /**
     * Generates the HTTP request to get the list of NS instances.
     *
     * @param search [Optional] NS instances attributes that must
     *                          be matched by the returned list
     *                          of NS instances.
     */
    requestNSInstances(search?) {
        this.loading = true;
        this.serviceManagementService
            .getNSInstances(search)
            .then(response => {
                this.loading = false;

                this.instances = response;
                this.dataSource = new MatTableDataSource(this.instances);
            })
            .catch(err => {
                this.loading = false;
                this.commonService.openSnackBar(err, '');
            });
    }

    // reloadInstance(row) {}

    terminate(row) {
        if (row.status.toUpperCase() !== 'TERMINATED') {
            const title = 'Are you sure...?';
            const content = 'Are you sure you want to terminate this instance?';
            const action = 'Terminate';

            this.dialogData.openDialog(title, content, action, () => {
                this.serviceManagementService
                    .postOneNSInstanceTermination(row.uuid)
                    .then(response => {
                        this.commonService.openSnackBar(response, '');
                        this.requestNSInstances();
                    })
                    .catch(err => {
                        this.commonService.openSnackBar(err, '');
                    });
            });
        } else {
            this.openInstance(row);
        }
    }

    openInstance(row) {
        const uuid = row.uuid;
        this.router.navigate([ uuid ], { relativeTo: this.route });
    }
}
