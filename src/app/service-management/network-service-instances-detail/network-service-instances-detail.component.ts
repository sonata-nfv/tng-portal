import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";

import { ServiceManagementService } from "../service-management.service";
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
          display: "none",
          opacity: 0,
          transform: "translateY(-100%)"
        })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "collapsed <=> expanded",
        // animate("1000ms cubic-bezier(0.68, -0.10s, 0.265, 1.10)")
        animate("600ms ease-in")
      )
    ])
  ]
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

  // Detail in row and animations
  dataSource = new CustomDataSource();
  vnfDetail = {};
  state: string = "collapsed";
  expandedElement: any;
  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty("detailRow");

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

        if (this.detail["vnf"]) {
          this.detail["vnf"].forEach(x => {
            x.updatedAt = new Date()
              .toISOString()
              .replace(/T.*/, "")
              .split("-")
              .reverse()
              .join("/");
          });

          this.dataSource.data = this.detail["vnf"];
        }
      })
      .catch(err => {
        this.loading = false;
      });
  }

  toggleDetail(row) {
    if (this.state == "expanded") {
      this.state = "collapsed";
    } else {
      this.requestVNF(row.vnfr_id);
      this.expandedElement = row;
    }
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
        this.state = "expanded";
      })
      .catch(err => {
        this.state = "expanded";
      });
  }

  terminate() {
    this.serviceManagementService.postOneNSInstanceTermination(
      this.detail["uuid"]
    );
  }

  close() {
    this.router.navigate(["service-management/network-service-instances"]);
  }
}
