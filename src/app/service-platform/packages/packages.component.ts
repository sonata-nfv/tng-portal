import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";

import { ServicePlatformService } from "../service-platform.service";
import { DialogDataService } from "../../shared/services/dialog/dialog.service";

@Component({
  selector: "app-packages",
  templateUrl: "./packages.component.html",
  styleUrls: ["./packages.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PackagesComponent implements OnInit {
  loading: boolean;
  packages = new Array();
  dataSource = new MatTableDataSource();
  displayedColumns = ["type", "vendor", "name", "version", "createdAt"];

  constructor(
    private servicePlatformService: ServicePlatformService,
    private router: Router,
    private dialogData: DialogDataService,
    private route: ActivatedRoute
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

    this.servicePlatformService
      .getPackages(search)
      .then(response => {
        this.loading = false;
        this.packages = response;
        this.dataSource = new MatTableDataSource(this.packages);
      })
      .catch(err => {
        this.loading = false;

        // Dialog informing the user to log in again when token expired
        if (err === "Unauthorized") {
          let title = "Your session has expired";
          let content =
            "Please, LOG IN again because your access token has expired.";
          let action = "Log in";

          this.dialogData.openDialog(title, content, action, () => {
            this.router.navigate(["/login"]);
          });
        }
      });
  }

  openPackage(row) {
    let uuid = row.uuid;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
