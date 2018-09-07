import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ServicePlatformService } from "../service-platform.service";
import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-sp-packages-detail",
  templateUrl: "./sp-packages-detail.component.html",
  styleUrls: ["./sp-packages-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SpPackagesDetailComponent implements OnInit {
  displayedColumns = ["name", "vendor", "version"];
  loading: boolean;
  detail = {};

  constructor(
    private servicePlatformService: ServicePlatformService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestPackage(uuid);
    });
  }

  /**
   * Generates the HTTP request of a package by UUID.
   *
   * @param uuid ID of the selected package to be displayed.
   *             Comming from the route.
   */
  requestPackage(uuid) {
    this.loading = true;

    this.servicePlatformService
      .getOnePackage(uuid)
      .then(response => {
        this.loading = false;
        this.detail = response;

        // TODO request to /packages/package_file_id
        this.detail["ns"] = [];
        this.detail["vnf"] = [];
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
        this.close();
      });
  }

  searchFieldData(search) {
    // TODO call request request to /packages/package_file_id the tests
  }

  close() {
    this.router.navigate(["service-platform/packages"]);
  }
}