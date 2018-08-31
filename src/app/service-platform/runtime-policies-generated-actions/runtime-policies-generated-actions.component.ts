import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { ServicePlatformService } from "../service-platform.service";
import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-runtime-policies-generated-actions",
  templateUrl: "./runtime-policies-generated-actions.component.html",
  styleUrls: ["./runtime-policies-generated-actions.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesGeneratedActionsComponent implements OnInit {
  loading: boolean;
  generatedActions = new Array();
  displayedColumns = [
    "vnfName",
    "scalingType",
    "serviceInstanceUUID",
    "value",
    "date"
  ];

  constructor(
    private commonService: CommonService,
    private servicePlatformService: ServicePlatformService
  ) {}

  ngOnInit() {
    this.requestGeneratedActions();
  }

  searchFieldData(search) {
    this.requestGeneratedActions(search);
  }

  /**
   * Generates the HTTP request to get the list of Generated Actions.
   *
   * @param search [Optional] Generated actions attributes that
   *                          must be matched by the returned
   *                          list of actions.
   */
  requestGeneratedActions(search?) {
    this.loading = true;

    this.servicePlatformService
      .getGeneratedActions(search)
      .then(response => {
        this.loading = false;
        this.generatedActions = response;
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(
          "There was an error while fetching the generated actions",
          ""
        );
      });
  }
}
