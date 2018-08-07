import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-network-service-instances",
  templateUrl: "./network-service-instances.component.html",
  styleUrls: ["./network-service-instances.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NetworkServiceInstancesComponent implements OnInit, OnDestroy {
  loading: boolean;
  searchText: string;
  instances: Array<Object>;
  dataSource = new MatTableDataSource();
  subscription: Subscription;
  displayedColumns = [
    "instanceId",
    "status",
    "serviceId",
    "version",
    "latestVersion",
    // "reload",
    "stop"
  ];

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private dialogData: DialogDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.requestNSInstances();

    // Reloads the template list every when children are closed
    this.subscription = this.router.events.subscribe(event => {
      if (
        event instanceof NavigationEnd &&
        event.url === "/service-management/network-service-instances" &&
        this.route.url["value"].length === 2 &&
        this.route.url["value"][1].path === "network-service-instances"
      ) {
        this.requestNSInstances();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchFieldData(search) {
    this.requestNSInstances(search);
  }

  /**
   * Generates the HTTP request to get the list of NS instances.
   *
   * @param search [Optional] NS instances attributes that must
   *                          be matched by the returned list
   *                          of NS instances.
   */
  requestNSInstances(search?) {
    this.loading = true;
    this.serviceManagementService
      .getNSInstances(search)
      .then(response => {
        this.loading = false;

        this.instances = response;
        this.dataSource = new MatTableDataSource(this.instances);
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

  // reloadInstance(row) {}

  terminate(row) {
    this.serviceManagementService.postOneNSInstanceTermination(row.uuid);
  }

  openInstance(row) {
    let uuid = row.uuid;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
