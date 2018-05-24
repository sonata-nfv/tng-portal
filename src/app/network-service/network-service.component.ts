import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material";

import { InstantiateDialogComponent } from "../instantiate-dialog/instantiate-dialog.component";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-network-service",
  templateUrl: "./network-service.component.html",
  styleUrls: ["./network-service.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NetworkServiceComponent implements OnInit {
  loading: boolean;

  name: string;
  author: string;
  version: string;
  vendor: string;
  serviceID: string;
  type: string;
  description: string;

  constructor(
    private serviceManagementService: ServiceManagementService,
    private dialogData: DialogDataService,
    private router: Router,
    private route: ActivatedRoute,
    private instantiateDialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = true;

    this.route.params.subscribe(params => {
      let uuid = params["id"];

      this.serviceManagementService
        .getNetworkService(uuid)
        .then(response => {
          this.loading = false;

          this.name = response.nsd.name;
          this.author = response.nsd.author;
          this.version = response.nsd.version;
          this.vendor = response.nsd.vendor;
          this.serviceID = response.uuid;
          this.type = response.user_licence;
          this.description = response.nsd.description;
          return;
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
    });
  }

  instanciate() {
    this.instantiateDialog.open(InstantiateDialogComponent, {
      data: {
        service: {
          serviceId: this.serviceID,
          serviceName: this.name
        }
      }
    });
  }

  close() {
    this.router.navigate(["service-management/available-network-services"]);
  }
}
