import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";

import { ServicePlatformService } from "../service-platform.service";
import { CommonService } from "../../shared/services/common/common.service";
import { DialogDataService } from "../../shared/services/dialog/dialog.service";

@Component({
  selector: "app-slices-instances",
  templateUrl: "./slices-instances.component.html",
  styleUrls: ["./slices-instances.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlicesInstancesComponent implements OnInit, OnDestroy {
  loading: boolean;
  instances = new Array();
  displayedColumns = ["vendor", "name", "version", "ID", "state", "stop"];
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private commonService: CommonService,
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
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
      });
  }

  stopInstance(item) {
    if (item.state.toUpperCase() != "TERMINATED") {
      let title = "Are you sure...?";
      let content = "Are you sure you want to terminate this instance?";
      let action = "Terminate";

      this.dialogData.openDialog(title, content, action, () => {
        this.servicePlatformService
          .postOneSliceInstanceTermination(item.uuid)
          .then(response => {
            this.commonService.openSnackBar(response, "");
            this.requestInstances();
          })
          .catch(err => {
            this.commonService.openSnackBar(err, "");
          });
      });
    } else {
      this.openInstance(item);
    }
  }

  openInstance(row) {
    let uuid = row.uuid;
    this.router.navigate([uuid], { relativeTo: this.route });
  }
}
