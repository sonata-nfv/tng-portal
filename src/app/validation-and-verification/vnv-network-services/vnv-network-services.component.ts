import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { CommonService } from "../../shared/services/common/common.service";
import { ValidationAndVerificationPlatformService } from "../validation-and-verification.service";

@Component({
  selector: "app-vnv-network-services",
  templateUrl: "./vnv-network-services.component.html",
  styleUrls: ["./vnv-network-services.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class VnvNetworkServicesComponent implements OnInit {
  loading: boolean;
  section: string;
  networkServices: Array<Object>;
  displayedColumns = ["type", "vendor", "name", "version", "status", "execute"];

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
  ) {}

  ngOnInit() {
    this.section = this.route.url["value"][0].path
      .replace(/-/g, " ")
      .toUpperCase();
    this.requestServices();
  }

  searchFieldData(search) {
    this.requestServices(search);
  }

  /**
   * Generates the HTTP request to get the list of NS.
   *
   * @param search [Optional] Network Service attributes that
   *                          must be matched by the returned
   *                          list of NS.
   */
  requestServices(search?) {
    this.loading = true;
    this.commonService
      .getNetworkServices(this.section, search)
      .then(response => {
        this.loading = false;
        this.networkServices = response;
      })
      .catch(err => {
        this.loading = false;
      });
  }

  execute(row) {
    this.verificationAndValidationPlatformService
      .postOneTest("service", row["uuid"])
      .then(response => {
        this.commonService.openSnackBar("Success!", "");
      })
      .catch(err => {
        this.commonService.openSnackBar(err, "");
      });
  }
}
