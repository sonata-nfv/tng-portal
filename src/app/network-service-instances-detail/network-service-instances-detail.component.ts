import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";
import { CustomDataSource } from "./custom-data-source.component";

@Component({
  selector: "app-network-service-instances-detail",
  templateUrl: "./network-service-instances-detail.component.html",
  styleUrls: ["./network-service-instances-detail.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({
          height: "0px",
          minHeight: "0",
          visibility: "hidden",
          display: "none"
        })
      ),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class NetworkServiceInstancesDetailComponent implements OnInit {
  loading: boolean = false;
  detail = {};
  vnfDetail = {};
  open: boolean = false;
  dataSource = new CustomDataSource();
  expandedElement: any;
  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty("detailRow");

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
            // x.version = "0";
            // x.status = "active";
            x.descriptorReference = "435219d-d773-4517-a5df-f97681f23456457";
            x.updatedAt = new Date()
              .toISOString()
              .replace(/T.*/, "")
              .split("-")
              .reverse()
              .join("/");
          });

          this.dataSource.data = this.detail["vnf"];
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

  /**
   * Generates the HTTP request of a VNF record by UUID.
   *
   * @param uuid ID of the selected VNF to be displayed.
   *             Comming from the route.
   */
  requestVNF(uuid) {
    this.serviceManagementService
      .getFunctionRecords(uuid)
      .then(response => {
        this.vnfDetail = response;

        // TODO change the string with commas for a view and pop up
        if (this.vnfDetail["virtualLinks"]) {
          this.vnfDetail["virtualLinks"].forEach(x => {
            x.connection_points_reference = x.connection_points_reference.join(
              ", "
            );
          });
        }
      })
      .catch(err => {
        this.vnfDetail["virtualLinks"] = new Array();
        this.vnfDetail["vdus"] = new Array();
      });
  }

  terminate() {}

  close() {
    this.router.navigate(["service-management/network-service-instances"]);
  }
}
