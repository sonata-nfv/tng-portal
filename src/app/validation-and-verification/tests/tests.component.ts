import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';

import { ValidationAndVerificationPlatformService } from '../validation-and-verification.service';
import { UtilsService } from '../../shared/services/common/utils.service';

@Component({
    selector: 'app-tests',
    templateUrl: './tests.component.html',
    styleUrls: [ './tests.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class TestsComponent implements OnInit {
    loading: boolean;
    tests = new Array();
    dataSource = new MatTableDataSource();
    displayedColumns = [ 'vendor', 'name', 'version', 'status' ]; // 'launch'
    subscription: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private utilsService: UtilsService,
        private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
    ) { }

    ngOnInit() {
        this.requestTests();
    }

    searchFieldData(search) {
        this.requestTests(search);
    }

    /**
     * Generates the HTTP request to get the list of tests.
     *
     * @param search [Optional] Test attributes that
     *                          must be matched by the returned
     *                          list of tests.
     */
    requestTests(search?) {
        this.loading = true;

        this.verificationAndValidationPlatformService
            .getTests(search)
            .then(response => {
                this.loading = false;
                this.tests = response;
                this.dataSource = new MatTableDataSource(this.tests);
            })
            .catch(err => this.utilsService.openSnackBar(err, ''));
    }

    openTest(row) {
        const uuid = row.uuid;
        this.router.navigate([ uuid ], { relativeTo: this.route });
    }

    launch(row) {
        this.verificationAndValidationPlatformService
            .postOneTest('test', row[ 'uuid' ])
            .then(response => {
                this.utilsService.openSnackBar('Success!', '');
            })
            .catch(err => {
                this.utilsService.openSnackBar(err, '');
            });
    }
}
