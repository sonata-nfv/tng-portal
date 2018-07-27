import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";

@Component({
  selector: "app-network-service-instances-detail",
  templateUrl: "./network-service-instances-detail.component.html",
  styleUrls: ["./network-service-instances-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NetworkServiceInstancesDetailComponent implements OnInit {
  loading: boolean = false;
  detail = {};
  displayedColumns = [
    "uuid",
    "version",
    "status",
    "descriptorReference",
    "updatedAt"
  ];
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
      let uuid = params["id"];
      this.requestNsInstance(uuid);
    });
  }

  /**
   * Generates the HTTP request of a NS Instance by UUID.
   *
   * @param uuid ID of the selected instance to be displayed.
   *             Comming from the route.
   */
  requestNsInstance(uuid) {
    this.loading = true;

    this.serviceManagementService
      .getOneNSInstance(uuid)
      .then(response => {
        this.loading = false;

        this.detail = response;

        // Set VNF fake until they come in response
        if (this.detail["vnf"]) {
          this.detail["vnf"].forEach(x => {
            x.version = "0";
            x.status = "active";
            x.descriptorReference = "435219d-d773-4517-a5df-f97681f23456457";
            x.updatedAt = new Date()
              .toISOString()
              .replace(/T.*/, "")
              .split("-")
              .reverse()
              .join("/");
          });
        }
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

  terminate() {}

  close() {
    this.router.navigate(["service-management/network-service-instances"]);
  }
}
