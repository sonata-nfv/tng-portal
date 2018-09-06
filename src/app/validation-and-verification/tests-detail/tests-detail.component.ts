import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ValidationAndVerificationPlatformService } from "../validation-and-verification.service";
import { CommonService } from "../../shared/services/common/common.service";
import { ChartService } from "../chart/chart.service";

@Component({
  selector: "app-tests-detail",
  templateUrl: "./tests-detail.component.html",
  styleUrls: ["./tests-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestsDetailComponent implements OnInit {
  loading: boolean;
  detail = {};
  executions = new Array();
  displayedColumns = ["vendor", "name", "version"];
  displayedColumnsExecutions = ["uuid", "serviceUUID", "date", "status"];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private chartService: ChartService,
    private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.requestTest(params["id"]);
      this.requestTestResult(params["id"]);
    });
  }

  /**
   * Generates the HTTP request of a Slices instance by UUID.
   *
   * @param uuid ID of the selected instance to be displayed.
   *             Comming from the route.
   */
  requestTest(uuid) {
    this.loading = true;
    this.verificationAndValidationPlatformService
      .getOneTest(uuid)
      .then(response => {
        this.detail = response;

      })
      .then(() => {
        this.verificationAndValidationPlatformService
          .getTestExecutions(this.detail["uuid"])
          .then(response => {
            this.loading = false;

            if (response.length < 1) {
              this.commonService.openSnackBar(
                "There are no test executions available",
                ""
              );
            } else {
              this.executions = response;
            }
          });
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
        this.close();
      });
  }

  requestTestResult(uuid) {
    this.verificationAndValidationPlatformService
    .getRslTest()
    .then(response => {
      this.loading = false;
    });
  }

  launch() {
    this.verificationAndValidationPlatformService
      .postOneTest("test", this.detail["uuid"])
      .then(response => {
        this.commonService.openSnackBar("Success!", "");
      })
      .catch(err => {
        this.commonService.openSnackBar(err, "");
      });
  }

  openTestResults(row) {
    this.router.navigate(["results", row["uuid"]], {
      relativeTo: this.route
    });

  }

  close() {
    this.router.navigate(["validation-and-verification/tests"]);
  }
}
