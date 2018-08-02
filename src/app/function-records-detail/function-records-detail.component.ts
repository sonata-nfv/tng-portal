import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";

@Component({
  selector: "app-function-records-detail",
  templateUrl: "./function-records-detail.component.html",
  styleUrls: ["./function-records-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FunctionRecordsDetailComponent implements OnInit {
  loading: boolean = false;
  detail = {};
  displayedColumnsConnPoints = [
    "id",
    "connectivity_type",
    "connection_points_reference"
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceManagementService: ServiceManagementService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["vnfr_id"];
      this.requestVNF(uuid);
    });
  }

  requestVNF(uuid) {
    this.loading = true;

    this.serviceManagementService
      .getFunctionRecords(uuid)
      .then(response => {
        console.log(response);

        this.loading = false;
        this.detail = response;

        // TODO change the string with commas for a view and pop up
        if (this.detail["virtualLinks"]) {
          this.detail["virtualLinks"].forEach(x => {
            x.connection_points_reference = x.connection_points_reference.join(
              ", "
            );
          });
        }
      })
      .catch(err => {
        this.loading = false;
      });
  }

  close() {
    this.router.navigate(["../../"], { relativeTo: this.route });
  }
}
