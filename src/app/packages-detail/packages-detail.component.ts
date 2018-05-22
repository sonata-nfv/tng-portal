import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";
import { DataTransferService } from "../shared/services/service-management/dataTransfer.service";

import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-packages-detail",
  templateUrl: "./packages-detail.component.html",
  styleUrls: ["./packages-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PackagesDetailComponent implements OnInit {
  package: Object = {};
  displayedColumns = ["name", "vendor", "version"];
  displayedColumnsTests = ["name", "creationDate", "status", "lastActivity"];
  searchText: string;

  constructor(
    private serviceManagementService: ServiceManagementService,
    private dialogData: DialogDataService,
    private router: Router,
    private route: ActivatedRoute,
    private dataTransfer: DataTransferService
  ) {}

  ngOnInit() {
    this.dataTransfer.data.subscribe(res => {
      this.package = res;
    });
    // TODO request
    this.package["ns"] = [];
    this.package["vnf"] = [];
    this.package["tests"] = [];

    // this.route.params.subscribe(params => {
    //   let uuid = params["id"];

    //   this.serviceManagementService
    //     .getPackage(uuid)
    //     .then(response => {
    //       this.package = response;
    //     })
    //     .catch(err => {
    //       // Dialog informing the user to log in again when token expired
    //       if (err === "Unauthorized") {
    //         let title = "Your session has expired";
    //         let content =
    //           "Please, LOG IN again because your access token has expired.";
    //         let action = "Log in";

    //         this.dialogData.openDialog(title, content, action, () => {
    //           this.router.navigate(["/login"]);
    //         });
    //       } else {
    //         // this.close();
    //         // TODO display dialog with error and close button
    //       }
    //     });
    // });
  }

  receiveMessage($event) {
    this.searchText = $event;
  }

  close() {
    this.router.navigate(["service-platform/packages"]);
  }
}
