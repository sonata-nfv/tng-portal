import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource, MatDialog } from "@angular/material";

import { Router, ActivatedRoute } from "@angular/router";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

import { InstantiateDialogComponent } from "../instantiate-dialog/instantiate-dialog.component";

@Component({
  selector: "app-available-network-services",
  templateUrl: "./available-network-services.component.html",
  styleUrls: ["./available-network-services.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AvailableNetworkServicesComponent {
  loading: boolean;
  networkServices: Array<Object>;
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "Name",
    "Vendor",
    "Version",
    "Licenses",
    "Type",
    "SLAs",
    "instanciate"
  ];
  searchText: string;

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

  receiveMessage($event) {
    this.searchText = $event;
  }

  requestServices() {
    this.loading = true;
    this.serviceManagementService
      .getNetworkServices()
      .then(response => {
        this.loading = false;

        // Populate the list of available network services
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

  instanciate(row) {
    this.instantiateDialog.open(InstantiateDialogComponent, {
      data: { service: row }
    });
  }
}
