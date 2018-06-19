import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-functions-detail",
  templateUrl: "./functions-detail.component.html",
  styleUrls: ["./functions-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FunctionsDetailComponent implements OnInit {
  loading: boolean;

  name: string;
  author: string;
  version: string;
  vendor: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: string;

  constructor(
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestFunction(uuid);
    });
  }

  /**
   * Generates the HTTP request of a function by UUID.
   *
   * @param uuid ID of the selected function to be displayed.
   *             Comming from the route.
   */
  requestFunction(uuid) {
    this.loading = true;

    this.servicePlatformService
      .getOneFunction(uuid)
      .then(response => {
        this.loading = false;

        this.name = response.name;
        this.author = response.author;
        this.version = response.version;
        this.vendor = response.vendor;
        this.type = response.type;
        this.description = response.description;
        this.createdAt = response.createdAt;
        this.updatedAt = response.updatedAt;
        this.status = response.status;
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

  close() {
    this.router.navigate(["service-platform/functions"]);
  }
}
