import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

import { Router } from "@angular/router";

@Component({
  selector: "app-network-service-instances",
  templateUrl: "./network-service-instances.component.html",
  styleUrls: ["./network-service-instances.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NetworkServiceInstancesComponent implements OnInit {
  loading: boolean;
  searchText: string;
  instances: Array<Object>;
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "instanceId",
    "status",
    "serviceId",
    "version",
    "latestVersion"
  ];

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.serviceManagementService
      .getInstances()
      .then(response => {
        this.loading = false;
        // Populate the list of instances
        this.instances = response.map(function(item) {
          if (item.length < 1) {
            return (this.instances = []);
          } else {
            return {
              searchField: item.uuid,
              instanceId: item.uuid,
              status: item.status,
              serviceId: item.descriptor_reference,
              version: item.version,
              latestVersion: ""
            };
          }
        });
        for (let i = 0; i < 5; i++) {
          this.instances = this.instances.concat(this.instances);
        }
        this.dataSource = new MatTableDataSource(this.instances);
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
}