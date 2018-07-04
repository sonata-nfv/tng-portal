import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-slices-instances-detail",
  templateUrl: "./slices-instances-detail.component.html",
  styleUrls: ["./slices-instances-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlicesInstancesDetailComponent implements OnInit {
  loading: boolean;
  detail = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.requestSliceInstance(params["id"]);
    });
  }

  /**
   * Generates the HTTP request of a Slices instance by UUID.
   *
   * @param uuid ID of the selected instance to be displayed.
   *             Comming from the route.
   */
  requestSliceInstance(uuid) {
    this.loading = true;

    this.servicePlatformService
      .getOneSliceInstance(uuid)
      .then(response => {
        this.loading = false;

        this.detail = response;
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

  stopInstance() {
    this.servicePlatformService.postOneSliceInstanceTermination(
      this.detail["uuid"]
    );
  }

  close() {
    this.router.navigate(["service-platform/slices/slices-instances"]);
  }
}
