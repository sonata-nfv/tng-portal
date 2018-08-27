import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ServiceManagementService } from "../service-management.service";
import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-request-detail",
  templateUrl: "./request-detail.component.html",
  styleUrls: ["./request-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RequestDetailComponent implements OnInit {
  loading: boolean;
  detail = {};

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestRequest(uuid);
    });
  }

  /**
   * Generates the HTTP request of a defined NS request by UUID.
   *
   * @param uuid ID of the selected NS request to be displayed.
   *             Comming from the route.
   */
  requestRequest(uuid) {
    this.loading = true;

    this.serviceManagementService
      .getOneNSRequest(uuid)
      .then(response => {
        this.loading = false;
        this.detail = response;
        this.prepareStringDisplayed();
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
        this.close();
      });
  }

  prepareStringDisplayed() {
    this.detail["type"] =
      this.detail["type"]
        .split("_")[0]
        .charAt(0)
        .toUpperCase() +
      this.detail["type"]
        .split("_")[0]
        .slice(1)
        .toLowerCase() +
      " " +
      this.detail["type"]
        .split("_")[1]
        .charAt(0)
        .toUpperCase() +
      this.detail["type"]
        .split("_")[1]
        .slice(1)
        .toLowerCase();

    this.detail["status"] =
      this.detail["status"].charAt(0).toUpperCase() +
      this.detail["status"].slice(1).toLowerCase();

    this.detail["updatedAt"] = new Date(
      Date.parse(this.detail["updatedAt"])
    ).toUTCString();
  }

  close() {
    this.router.navigate(["service-management/requests"]);
  }
}
