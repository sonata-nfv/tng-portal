import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material";

import { NsInstantiateDialogComponent } from "../ns-instantiate-dialog/ns-instantiate-dialog.component";

import { CommonService } from "../shared/services/common/common.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-sm-network-services-detail",
  templateUrl: "./sm-network-services-detail.component.html",
  styleUrls: ["./sm-network-services-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SmNetworkServicesDetailComponent implements OnInit {
  loading: boolean;

  name: string;
  author: string;
  version: string;
  vendor: string;
  serviceID: string;
  type: string;
  description: string;
  createdAt: string;

  constructor(
    private commonService: CommonService,
    private dialogData: DialogDataService,
    private router: Router,
    private route: ActivatedRoute,
    private instantiateDialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestNS(uuid);
    });
  }

  /**
   * Generates the HTTP request of a NS by UUID.
   *
   * @param uuid ID of the selected NS to be displayed.
   *             Comming from the route.
   */
  requestNS(uuid) {
    this.loading = true;

    this.commonService
      .getOneNetworkService(uuid)
      .then(response => {
        this.loading = false;

        this.name = response.name;
        this.author = response.author;
        this.version = response.version;
        this.vendor = response.vendor;
        this.serviceID = response.serviceID;
        this.type = response.type;
        this.description = response.description;
        this.createdAt = response.createdAt;
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

  instanciate() {
    this.instantiateDialog.open(NsInstantiateDialogComponent, {
      data: {
        serviceUUID: this.serviceID,
        serviceName: this.name
      }
    });
  }

  close() {
    this.router.navigate(["service-management/sm-network-services"]);
  }
}
