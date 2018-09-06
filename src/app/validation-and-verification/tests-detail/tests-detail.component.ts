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
      let index;

      for (var j = 0; j < response["data"].length; j++) {
        if (uuid == response["data"][j]["test_uuid"]) {
          index = j;
        }
      }

      let details = response["data"][index];

      let multiChart = {
        chart: [],
        type: [],
        title: [],
        xTitle: [],
        yTitle: [],
        s1x: [],
        s1y: [],
        s2x: [],
        s2y: []
      };

      if (details["details"] !== null) {
        
        let graphs = response["data"][index]["details"]["graphs"];

        for (var i = 0; i < graphs.length; i++) {
          let div = document.createElement("div"),
            canvas = document.createElement("canvas");
          canvas.setAttribute("id", "chrat-" + i);
          document
            .getElementById("multychart")
            .appendChild(div)
            .appendChild(canvas);
          multiChart.chart.push(i);
          multiChart.type.push(graphs[i]["type"]);
          multiChart.title.push(graphs[i]["title"]);
          multiChart.xTitle.push(graphs[i]["x-axis-title"]);
          multiChart.yTitle.push(graphs[i]["y-axis-title"]);
          multiChart.s1x.push(graphs[i]["data"]["s1x"]);
          multiChart.s1y.push(graphs[i]["data"]["s1y"]);
          multiChart.s2x.push(graphs[i]["data"]["s2x"]);
          multiChart.s2y.push(graphs[i]["data"]["s2y"]);
        }

        for (let i = 0; i < multiChart.chart.length; i++) {
          if (
            multiChart.type[i] == "line" &&
            multiChart.s2y[i] !== undefined
          ) {
            this.chartService.chartBar(
              false, true,
              "chrat-" + multiChart.chart[i],
              multiChart.type[i],
              multiChart.title[i],
              multiChart.xTitle[i],
              multiChart.s1y[i],
              multiChart.s2y[i],
              multiChart.yTitle[i],
              multiChart.s1x[i]
            );
          } else {
            this.chartService.chartBar(
              true, false,
              "chrat-" + multiChart.chart[i],
              multiChart.type[i],
              multiChart.title[i],
              multiChart.xTitle[i],
              multiChart.s1y[i],
              multiChart.s2y[i],
              multiChart.yTitle[i],
              multiChart.s1x[i]
            );
          }
        }
      } else {
      }

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
