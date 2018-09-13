import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { CommonService } from "../../shared/services/common/common.service";
import { ValidationAndVerificationPlatformService } from "../validation-and-verification.service";

@Component({
  selector: "app-vnv-network-services-detail",
  templateUrl: "./vnv-network-services-detail.component.html",
  styleUrls: ["./vnv-network-services-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class VnvNetworkServicesDetailComponent implements OnInit {
  loading: boolean;
  detail = {};
  displayedColumns = ["id", "name", "vendor", "version"];

  constructor(
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestNetworkService(uuid);
    });
  }

  requestNetworkService(uuid) {
    this.loading = true;

    this.commonService
      .getOneNetworkService("vnv", uuid)
      .then(response => {
        this.loading = false;
        this.detail = response;

        if (this.detail["vnf"].lenght < 1) {
          this.detail["vnf"] = [];
        }
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
        this.close();
      });
  }

  execute() {
    this.verificationAndValidationPlatformService
      .postOneTest("service", this.detail["uuid"])
      .then(response => {
        this.commonService.openSnackBar("Success!", "");
      })
      .catch(err => {
        this.commonService.openSnackBar(err, "");
      });
  }

  close() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
