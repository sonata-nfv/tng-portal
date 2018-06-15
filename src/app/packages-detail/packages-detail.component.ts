import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-packages-detail",
  templateUrl: "./packages-detail.component.html",
  styleUrls: ["./packages-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PackagesDetailComponent implements OnInit {
  displayedColumns = ["name", "vendor", "version"];
  displayedColumnsTests = ["name", "creationDate", "status", "lastActivity"];
  loading: boolean;

  name: string;
  author: string;
  createdAt: string;
  vendor: string;
  version: string;
  type: string;
  ns: Array<Object>;
  vnf: Array<Object>;
  tests: Array<Object>;

  constructor(
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService,
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

        this.name = response.name;
        this.author = response.author;
        this.createdAt = response.createdAt;
        this.vendor = response.vendor;
        this.version = response.version;
        this.type = response.type;

        // TODO request to /packages/package_file_id
        this.ns = [];
        this.vnf = [];
        this.tests = [];
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
        } else {
          this.close();
        }
      });
  }

  searchFieldData(search) {
    // TODO call request request to /packages/package_file_id the tests
  }

  close() {
    this.router.navigate(["service-platform/packages"]);
  }
}
