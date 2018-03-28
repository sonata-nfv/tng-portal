import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource, MatDialog } from "@angular/material";

import { Router, ActivatedRoute } from "@angular/router";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";
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
    "Status",
    "Service Name",
    "Vendor",
    "Version",
    "Service ID",
    "Type",
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
    this.loading = true;
    this.serviceManagementService
      .getNetworkServices()
      .then(response => {
        this.loading = false;
        // Populate the list of available network services
        this.networkServices = response.map(function(item) {
          return {
            searchField: item.nsd.name,
            status: item.status,
            serviceName: item.nsd.name,
            vendor: item.nsd.vendor,
            version: item.nsd.version,
            serviceId: item.uuid,
            type: item.user_licence
          };
        });
        this.dataSource = new MatTableDataSource(this.networkServices);
      })
      .catch(err => {
        this.loading = false;
        console.error(err);
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

  receiveMessage($event) {
    this.searchText = $event;
  }

  openNetworkService(row) {
    let uuid = row.serviceId;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }

  instanciate(row) {
    this.instantiateDialog.open(InstantiateDialogComponent, {
      data: { serviceName: row.serviceName }
    });
  }
}
