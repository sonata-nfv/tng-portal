import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-vnv-packages",
  templateUrl: "./vnv-packages.component.html",
  styleUrls: ["./vnv-packages.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class VnvPackagesComponent implements OnInit {
  loading: boolean;
  section: string;
  packages = new Array();
  displayedColumns = ["type", "vendor", "name", "version", "status"];

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.section = this.route.url["value"][0].path
      .replace(/-/g, " ")
      .toUpperCase();
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

    this.commonService
      .getPackages(this.section, search)
      .then(response => {
        this.loading = false;
        this.packages = response;
      })
      .catch(err => {
        this.loading = false;
      });
  }
}
