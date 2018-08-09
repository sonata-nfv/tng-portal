import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ValidationAndVerificationPlatformService } from "../validation-and-verification.service";

@Component({
  selector: "app-vnv-packages",
  templateUrl: "./vnv-packages.component.html",
  styleUrls: ["./vnv-packages.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class VnvPackagesComponent implements OnInit {
  loading: boolean;
  packages = new Array();
  displayedColumns = ["type", "vendor", "name", "version", "status"];

  constructor(
    private validationAndVerificationPlatformService: ValidationAndVerificationPlatformService
  ) {}

  ngOnInit() {
    this.requestPackages();
  }

  searchFieldData(search) {
    this.requestPackages(search);
  }

  /**
   * Generates the HTTP request to get the list of packages.
   *
   * @param search [Optional] Package attributes that must be
   *                          matched by the returned list of
   *                          packages.
   */
  requestPackages(search?) {
    this.loading = true;

    this.validationAndVerificationPlatformService
      .getPackages(search)
      .then(response => {
        this.loading = false;
        this.packages = response;
      })
      .catch(err => {
        this.loading = false;
      });
  }
}
