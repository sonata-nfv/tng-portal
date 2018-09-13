import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { ServicePlatformService } from "../service-platform.service";
import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-sla-violations",
  templateUrl: "./sla-violations.component.html",
  styleUrls: ["./sla-violations.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlaViolationsComponent implements OnInit {
  loading: boolean = false;
  violations = new Array();
  displayedColumns = ["nsInstanceUUID", "slaUUID", "customerUUID", "date"];

  constructor(
    private servicePlatformService: ServicePlatformService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.requestViolations();
  }

  searchFieldData(search) {
    this.requestViolations(search);
  }

  /**
   * Generates the HTTP request to get the list of SLA violations.
   *
   * @param search [Optional] SLA violations attributes that
   *                          must be matched by the returned
   *                          list of violations.
   */
  requestViolations(search?) {
    this.loading = true;

    this.servicePlatformService
      .getSLAViolations(search)
      .then(response => {
        this.loading = false;
        this.violations = response;
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
      });
  }
}
