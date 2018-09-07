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
  charts = {};
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
        this.charts = {
          ds: {
            chart: [],
            type_: [],
            title: [],
            xTtle: [],
            yTtle: []
          },
          s1: {
            serie: [],
            xAxis: [],
            yAxis: []
          },
          s2: {
            serie: [],
            xAxis: [],
            yAxis: []
          },
          s3: {
            serie: [],
            xAxis: [],
            yAxis: []
          }
        };
        if (this.detail["graphs"] !== null) {
          this.savData("div", "canvas", this.charts, this.detail);        // save api data
          this.setData(this.charts);                                      // display data in charts
        }
      })
      .then(() => {})
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
        this.close();
      });
  }

  savData(parent, child, chart, detail) {
    for (var i = 0; i < detail["graphs"].length; i++) {
      let parentBlock = document.createElement(parent),
          childBlock = document.createElement(child);
      childBlock.setAttribute("id", "chrat-" + i);
      document.getElementById("charts") .appendChild(parentBlock).appendChild(childBlock);
      chart["ds"]["chart"].push(i);
      chart["ds"]["type_"].push(detail["graphs"][i]["type"]);
      chart["ds"]["title"].push(detail["graphs"][i]["title"]);
      chart["ds"]["xTtle"].push(detail["graphs"][i]["x-axis-title"]);
      chart["ds"]["yTtle"].push(detail["graphs"][i]["y-axis-title"]);
      chart["s1"]["serie"].push(detail["graphs"][i]["series"]["s1"]);
      chart["s1"]["xAxis"].push(detail["graphs"][i]["data"]["s1x"]);
      chart["s1"]["yAxis"].push(detail["graphs"][i]["data"]["s1y"]);
      chart["s2"]["serie"].push(detail["graphs"][i]["series"]["s2"]);
      chart["s2"]["yAxis"].push(detail["graphs"][i]["data"]["s2y"]);
      chart["s3"]["serie"].push(detail["graphs"][i]["series"]["s3"]);
      chart["s3"]["yAxis"].push(detail["graphs"][i]["data"]["s3y"]);
    }
  }
  
  setData(chart) {
    for (let i = 0; i < chart["ds"]["chart"].length; i++) {
      let s1Line = [
          {
            label: "[ " + "s1: " + ' " ' + chart["s1"]["serie"][i] + ' " ' + " ]",
            data: chart["s1"]["yAxis"][i],
            fill: false,
            lineTension: 0.2,
            backgroundColor: "#f0f0f0",
            borderColor: "red",
            borderWidth: 0.8
          }
        ],
        s2Line = [
          s1Line[0],
          {
            label: "[ " + "s2: " + ' " ' + chart["s2"]["serie"][i] + ' " ' + " ]",
            data: chart["s2"]["yAxis"][i],
            fill: false,
            lineTension: 0.2,
            backgroundColor: "#f0f0f0",
            borderColor: "blue",
            borderWidth: 0.8
          }
        ],
        s3Line = [
          s2Line[0],
          s2Line[1],
          {
            label: "[ " + "s3: " + ' " ' + chart["s3"]["serie"][i] + ' " ' + " ]",
            data: chart["s3"]["yAxis"][i],
            fill: false,
            lineTension: 0.2,
            backgroundColor: "#f0f0f0",
            borderColor: "brown",
            borderWidth: 0.8
          }
        ],
        setCharts = {
          chart: "chrat-" + chart["ds"]["chart"][i],
          type_: chart["ds"]["type_"][i],
          title: chart["ds"]["title"][i],
          xTtle: chart["ds"]["xTtle"][i],
          xAxis: chart["s1"]["xAxis"][i],
          yTtle: chart["ds"]["yTtle"][i],
          yAxis: chart["s2"]["yAxis"][i],
        };
      if (chart["s1"]["yAxis"][i] !== undefined) {
        this.chartService.chartBar(false, s1Line, setCharts);
      }
      if (chart["s1"]["yAxis"][i] !== undefined && chart["s2"]["yAxis"][i] !== undefined ) {
        this.chartService.chartBar(true, s2Line, setCharts);
      }
      if (chart["s1"]["yAxis"][i] !== undefined && chart["s2"]["yAxis"][i] !== undefined && chart["s3"]["yAxis"][i] !== undefined ) {
        this.chartService.chartBar(true, s3Line, setCharts);
      }
    }
  }

  close() {
    this.router.navigate(["validation-and-verification/tests", this.testUUID]);
  }
}
