import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material";

import { ServicePlatformService } from "../service-platform.service";

import { DialogDataService } from "../../shared/services/dialog/dialog.service";
import { SlicesInstancesCreateComponent } from "../slices-instances-create/slices-instances-create.component";

@Component({
  selector: "app-slices-templates-detail",
  templateUrl: "./slices-templates-detail.component.html",
  styleUrls: ["./slices-templates-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlicesTemplatesDetailComponent implements OnInit {
  loading: boolean;
  detail = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService,
    private instantiateDialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.requestSlicesTemplate(params["id"]);
    });
  }

  /**
   * Generates the HTTP request of a Slices Template by UUID.
   *
   * @param uuid ID of the selected template to be displayed.
   *             Comming from the route.
   */
  requestSlicesTemplate(uuid) {
    this.loading = true;

    this.servicePlatformService
      .getOneSliceTemplate(uuid)
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

  instantiate() {
    this.instantiateDialog.open(SlicesInstancesCreateComponent, {
      data: {
        nstId: this.detail["uuid"],
        vendor: this.detail["vendor"],
        name: this.detail["name"],
        version: this.detail["version"]
      }
    });
  }

  deleteTemplate() {
    this.loading = true;
    this.servicePlatformService
      .deleteOneSlicesTemplate(this.detail["uuid"])
      .then(response => {
        this.close();
      })
      .catch(err => {
        this.loading = false;
        this.close();
        // TODO display request status in toast
      });
  }

  close() {
    this.router.navigate(["service-platform/slices/slices-templates"]);
  }
}
