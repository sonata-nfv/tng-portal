import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";
import { DataTransferService } from "../shared/services/service-management/dataTransfer.service";

import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RequestsComponent implements OnInit {
  loading: boolean;
  requests = new Array();
  selectedRequest: Object = null;
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "Request ID",
    "Type",
    "Created at",
    "Service ID",
    "Status"
  ];
  searchText: string;

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private dialogData: DialogDataService,
    private route: ActivatedRoute,
    private dataTransfer: DataTransferService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.serviceManagementService
      .getRequests()
      .then(response => {
        this.loading = false;
        this.requests = response.map(function(item) {
          return {
            searchField: item.id,
            requestId: item.id,
            type: item.request_type,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            serviceId: item.service_uuid,
            status: item.status
          };
        });
        for (let i = 0; i < 5; i++) {
          this.requests = this.requests.concat(this.requests);
        }
        this.dataSource = new MatTableDataSource(this.requests);
      })
      .catch(err => {
        this.loading = false;
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
        }
      });
  }

  receiveMessage($event) {
    this.searchText = $event;
  }

  openRequest(row) {
    let uuid = row.requestId;
    let detail = this.requests.find(x => x.requestId === uuid);
    this.dataTransfer.sendDetail(detail);
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
