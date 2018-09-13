import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { CommonService } from "../../services/common/common.service";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RequestsComponent implements OnInit {
  loading: boolean;
  requests = new Array();
  section: string;
  displayedColumns = ["name", "serviceName", "createdAt", "type", "status"];
  searchText: string;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.section = this.route.url["value"][0].path
      .replace(/-/g, " ")
      .toUpperCase();

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
    this.commonService
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
    this.router.navigate([uuid], { relativeTo: this.route });
  }
}
