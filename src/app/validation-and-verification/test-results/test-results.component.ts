import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { CommonService } from "../../shared/services/common/common.service";
import { ValidationAndVerificationPlatformService } from "../validation-and-verification.service";
import { ChartService } from "../chart/chart.service";

@Component({
  selector: "app-test-results",
  templateUrl: "./test-results.component.html",
  styleUrls: ["./test-results.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestResultsComponent implements OnInit {
  loading: boolean;
  detail = {};
  testUUID: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private chartService: ChartService,
    private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.testUUID = params["id"];
      this.requestResults(params["results_uuid"]);
    });
  }

  requestResults(uuid) {
    this.loading = true;
    this.verificationAndValidationPlatformService
      .getTestResults(uuid)
      .then(response => {
        this.loading = false;
        this.detail = response;

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

        if (this.detail["graphs"] !== null) {
          for (var i = 0; i < this.detail["graphs"].length; i++) {
            let div = document.createElement("div"),
              canvas = document.createElement("canvas");

            canvas.setAttribute("id", "chrat-" + i);
            document
              .getElementById("multychart")
              .appendChild(div)
              .appendChild(canvas);

            multiChart.chart.push(i);
            multiChart.type.push(this.detail["graphs"][i]["type"]);
            multiChart.title.push(this.detail["graphs"][i]["title"]);
            multiChart.xTitle.push(this.detail["graphs"][i]["x-axis-title"]);
            multiChart.yTitle.push(this.detail["graphs"][i]["y-axis-title"]);
            multiChart.s1x.push(this.detail["graphs"][i]["data"]["s1x"]);
            multiChart.s1y.push(this.detail["graphs"][i]["data"]["s1y"]);
            multiChart.s2x.push(this.detail["graphs"][i]["data"]["s2x"]);
            multiChart.s2y.push(this.detail["graphs"][i]["data"]["s2y"]);
          }

          console.log(
            "TCL: TestResultsComponent -> requestResults -> multiChart",
            multiChart
          );

          for (let i = 0; i < multiChart.chart.length; i++) {
            if (
              multiChart.type[i] == "line" &&
              multiChart.s2y[i] !== undefined
            ) {
              this.chartService.chartBar(
                false,
                true,
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
                true,
                false,
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
        }
      })
      .then(() => {})
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
        this.close();
      });
  }

  close() {
    this.router.navigate(["validation-and-verification/tests", this.testUUID]);
  }
}
