import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-sp-network-services",
  templateUrl: "./sp-network-services.component.html",
  styleUrls: ["./sp-network-services.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SpNetworkServicesComponent implements OnInit {
  loading: boolean;
  networkServices: Array<Object>;
  dataSource = new MatTableDataSource();
  displayedColumns = ["Vendor", "Name", "Version", "Type", "SLAs", "Policies"];

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private dialogData: DialogDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
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
    this.serviceManagementService
      .getNetworkServices(search)
      .then(response => {
        this.loading = false;

        this.networkServices = response;
        this.dataSource = new MatTableDataSource(this.networkServices);
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

  openNetworkService(row) {}
}
