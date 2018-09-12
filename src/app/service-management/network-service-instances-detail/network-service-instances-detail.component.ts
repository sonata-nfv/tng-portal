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
import { CommonService } from "../../shared/services/common/common.service";
import { CustomDataSource } from "./custom-data-source.component";
import { DialogDataService } from "../../shared/services/dialog/dialog.service";

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
  displayedColumns = ["uuid", "version", "status", "updatedAt"];

  // Detail in row and animations
  dataSource = new CustomDataSource();
  vnfDetail = {};
  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty("detailRow");

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialogData: DialogDataService,
    private commonService: CommonService,
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
        this.detail = response;

        if (this.detail["vnf"]) {
          Promise.all(
            this.detail["vnf"].map(item =>
              this.serviceManagementService.getOneFunctionRecord(item.vnfr_id)
            )
          )
            .then(responses => {
              this.loading = false;
              this.dataSource.data = responses;
            })
            .catch(err => {
              this.loading = false;
              this.commonService.openSnackBar(err, "");
            });
        }
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
        this.close();
      });
  }

  terminate() {
    let title = "Are you sure...?";
    let content = "Are you sure you want to terminate this instance?";
    let action = "Terminate";

    this.dialogData.openDialog(title, content, action, () => {
      this.serviceManagementService
        .postOneNSInstanceTermination(this.detail["uuid"])
        .then(response => {
          this.commonService.openSnackBar(response, "");
        })
        .catch(err => {
          this.commonService.openSnackBar(err, "");
        });
    });
  }

  close() {
    this.router.navigate(["service-management/network-service-instances"]);
  }
}
