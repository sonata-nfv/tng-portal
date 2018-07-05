import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RequestsComponent implements OnInit {
  loading: boolean;
  requests = new Array();
  dataSource = new MatTableDataSource();
  displayedColumns = [
    // "vendor",
    // "name",
    // "version",
    "Created at",
    "Request ID",
    "Type",
    "Service ID",
    "Status"
  ];
  searchText: string;

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private dialogData: DialogDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.requestRequests();
  }

  searchFieldData(search) {
    this.requestRequests(search);
  }

  /**
   * Generates the HTTP request to get the list of NS requests.
   *
   * @param search [Optional] NS requests attributes that must
   *                          be matched by the returned list
   *                          of NS requests.
   */
  requestRequests(search?) {
    this.loading = true;
    this.serviceManagementService
      .getNSRequests(search)
      .then(response => {
        this.loading = false;

        this.requests = response;
        this.dataSource = new MatTableDataSource(this.requests);
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
        }
      });
  }

  openRequest(row) {
    let uuid = row.requestId;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
