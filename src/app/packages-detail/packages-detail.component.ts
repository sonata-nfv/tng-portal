import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-packages-detail",
  templateUrl: "./packages-detail.component.html",
  styleUrls: ["./packages-detail.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class PackagesDetailComponent implements OnInit {
  package: Object;

  constructor(
    private serviceManagementService: ServiceManagementService,
    private dialogData: DialogDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];

      this.serviceManagementService
        .getPackage(uuid)
        .then(response => {
          this.package = response;
        })
        .catch(err => {
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
          } else {
            this.router.navigate(["/packages"]);
          }
        });
    });
  }

  close() {
    this.router.navigate(["/packages"]);
  }
}
