import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ValidationAndVerificationPlatformService } from "../validation-and-verification.service";
import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-tests-detail",
  templateUrl: "./tests-detail.component.html",
  styleUrls: ["./tests-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestsDetailComponent implements OnInit {
  loading: boolean;
  detail = {};
  displayedColumns = ["vendor", "name", "version"];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.requestTest(params["id"]);
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
        this.loading = false;
        this.detail = response;
      })
      .catch(err => console.error(err));
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

  close() {
    this.router.navigate(["validation-and-verification/tests"]);
  }
}
