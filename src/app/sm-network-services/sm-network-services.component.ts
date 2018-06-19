import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";

import { InstantiateDialogComponent } from "../instantiate-dialog/instantiate-dialog.component";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-sm-network-services",
  templateUrl: "./sm-network-services.component.html",
  styleUrls: ["./sm-network-services.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SmNetworkServicesComponent {
  loading: boolean;
  networkServices: Array<Object>;
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "Vendor",
    "Name",
    "Version",
    "Status",
    "Licenses",
    "SLAs",
    "instantiate"
  ];

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private dialogData: DialogDataService,
    private route: ActivatedRoute,
    private instantiateDialog: MatDialog
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

  openNetworkService(row) {
    let uuid = row.serviceId;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }

  instantiate(row) {
    this.instantiateDialog.open(InstantiateDialogComponent, {
      data: { service: row }
    });
  }
}
