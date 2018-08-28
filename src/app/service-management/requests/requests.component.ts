import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ServiceManagementService } from "../service-management.service";
import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RequestsComponent implements OnInit {
  loading: boolean;
  requests = new Array();
  displayedColumns = ["name", "serviceName", "createdAt", "type", "status"];
  searchText: string;

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private commonService: CommonService,
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
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
      });
  }

  openRequest(row) {
    let uuid = row.requestId;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
