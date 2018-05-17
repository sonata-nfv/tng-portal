import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-packages-detail",
  templateUrl: "./packages-detail.component.html",
  styleUrls: ["./packages-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PackagesDetailComponent implements OnInit {
  package: Object;
  displayedColumns = ["name", "vendor", "version"];
  displayedColumnsTests = ["name", "creationDate", "status", "lastActivity"];
  ns = new Array();
  vnf = new Array();
  searchText: string;
  tests = new Array();

  constructor(
    private serviceManagementService: ServiceManagementService,
    private dialogData: DialogDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    for (let i = 0; i < 4; i++) {
      this.ns.push({
        name: "ns1",
        vendor: "eu.sonata-nfv-service-description",
        version: "0.1"
      });
      this.vnf.push({
        name: "vnf1",
        vendor: "eu.sonata-nfv-service-description",
        version: "0.1"
      });
      this.tests.push(
        {
          searchField: "test2",
          name: "test2",
          creationDate: "assdghfdgfkhjgljñkddfghgn",
          status: "activated",
          lastActivity: "assdghfdgfkhjgljñkddfghgn"
        },
        {
          searchField: "test1",
          name: "test1",
          creationDate: "assdghfdgfkhjgljñkddfghgn",
          status: "activated",
          lastActivity: "assdghfdgfkhjgljñkddfghgn"
        }
      );
    }

    this.route.params.subscribe(params => {
      let uuid = params["id"];

      this.serviceManagementService
        .getPackage(uuid)
        .then(response => {
          this.package = response;
        })
        .catch(err => {
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
            // this.close();
          }
        });
    });
  }

  receiveMessage($event) {
    this.searchText = $event;
  }

  close() {
    this.router.navigate(["service-platform/packages"]);
  }
}
