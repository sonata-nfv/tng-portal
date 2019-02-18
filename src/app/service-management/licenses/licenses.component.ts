import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { ServiceManagementService } from '../service-management.service';
import { DialogDataService } from '../../shared/services/dialog/dialog.service';

@Component({
    selector: 'app-licenses',
    templateUrl: './licenses.component.html',
    styleUrls: [ './licenses.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class LicencesComponent implements OnInit {
    loading: boolean;
    licenses = new Array();
    dataSource = new MatTableDataSource();
    displayedColumns = [ 'Status', 'Licence ID', 'Related Service', 'Type', 'buy' ];
    searchText: string;

    constructor(
        private serviceManagementService: ServiceManagementService,
        private router: Router,
        private route: ActivatedRoute,
        private dialogData: DialogDataService
    ) { }

    ngOnInit() {
        this.requestLicences();
    }

    requestLicences() {
        this.loading = true;
        this.serviceManagementService
            .getLicences()
            .then(response => {
                this.loading = false;
                this.licenses = response.map(function (item) {
                    return {
                        searchField: item.licence_uuid,
                        licenceId: item.licence_uuid,
                        relatedService: item.service_uuid,
                        type: item.licence_type,
                        description: item.description,
                        status: item.status
                    };
                });
            })
            .catch(err => {
                this.loading = false;
                console.error(err);

                // Dialog informing the user to log in again when token expired
                if (err === 'Unauthorized') {
                    const title = 'Your session has expired';
                    const content =
                        'Please, LOG IN again because your access token has expired.';
                    const action = 'Log in';

                    this.dialogData.openDialog(title, content, action, () => {
                        this.router.navigate([ '/login' ]);
                    });
                }
            });
    }

    receiveMessage($event) {
        this.searchText = $event;
    }
    openLicences(row) {
        const uuid = row.licenceId;
        this.getLicenceById(uuid);
        this.router.navigate([ uuid ], { relativeTo: this.route });
    }

    getLicenceById(uuid) {
        const detail = this.licenses.find(x => x.licenceId === uuid);
    }

    buy(row) { }
}
