import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-slices-instances",
  templateUrl: "./slices-instances.component.html",
  styleUrls: ["./slices-instances.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlicesInstancesComponent implements OnInit, OnDestroy {
  loading: boolean;
  instances = new Array();
  dataSource = new MatTableDataSource();
  displayedColumns = ["vendor", "name", "version", "ID", "state", "stop"];
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.requestInstances();

    // Reloads the template list every when children are closed
    this.subscription = this.router.events.subscribe(event => {
      if (
        event instanceof NavigationEnd &&
        event.url === "/service-platform/slices/slices-instances" &&
        this.route.url["value"].length === 3 &&
        this.route.url["value"][2].path === "slices-instances"
      ) {
        this.requestInstances();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchFieldData(search) {
    this.requestInstances(search);
  }

  /**
   * Generates the HTTP request to get the list of Slice instances.
   *
   * @param search [Optional] Slice instances attributes that
   *                          must be matched by the returned
   *                          list of instances.
   */
  requestInstances(search?) {
    this.loading = true;

    this.servicePlatformService
      .getSlicesInstances(search)
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

  stopInstance(item) {
    if (item.state != "TERMINATED") {
      this.servicePlatformService.postOneSliceInstanceTermination(item.uuid);
    } else {
      this.openInstance(item);
    }
  }

  openInstance(row) {
    let uuid = row.uuid;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
