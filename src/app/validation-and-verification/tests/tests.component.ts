import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { Subscription } from "rxjs";

import { ValidationAndVerificationPlatformService } from "../validation-and-verification.service";
import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-tests",
  templateUrl: "./tests.component.html",
  styleUrls: ["./tests.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestsComponent implements OnInit {
  loading: boolean;
  tests = new Array();
  dataSource = new MatTableDataSource();
  displayedColumns = ["vendor", "name", "version", "status", "launch"];
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
  ) {}

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
      .catch(err => console.error(err));
  }

  openTest(row) {
    let uuid = row.uuid;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }

  launch(row) {
    this.verificationAndValidationPlatformService
      .postOneTest("test", row["uuid"])
      .then(response => {
        this.commonService.openSnackBar("Success!", "");
      })
      .catch(err => {
        this.commonService.openSnackBar(err, "");
      });
  }
}
