import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-request-detail",
  templateUrl: "./request-detail.component.html",
  styleUrls: ["./request-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RequestDetailComponent implements OnInit {
  loading: boolean;

  requestID: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  serviceID: string;
  status: string;

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestRequest(uuid);
    });
  }

  /**
   * Generates the HTTP request of a defined NS request by UUID.
   *
   * @param uuid ID of the selected NS request to be displayed.
   *             Comming from the route.
   */
  requestRequest(uuid) {
    this.loading = true;

    this.serviceManagementService
      .getOneNSRequest(uuid)
      .then(response => {
        this.loading = false;

        this.requestID = response.requestID;
        this.type = response.type;
        this.createdAt = response.createdAt;
        this.updatedAt = response.updatedAt;
        this.serviceID = response.serviceID;
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
    this.router.navigate(["service-management/requests"]);
  }
}
