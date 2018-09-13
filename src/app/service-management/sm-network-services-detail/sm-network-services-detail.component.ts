import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material";

import { NsInstantiateDialogComponent } from "../ns-instantiate-dialog/ns-instantiate-dialog.component";

import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-sm-network-services-detail",
  templateUrl: "./sm-network-services-detail.component.html",
  styleUrls: ["./sm-network-services-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SmNetworkServicesDetailComponent implements OnInit {
  loading: boolean;
  detail = {};

  constructor(
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private instantiateDialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestNS(uuid);
    });
  }

  /**
   * Generates the HTTP request of a NS by UUID.
   *
   * @param uuid ID of the selected NS to be displayed.
   *             Comming from the route.
   */
  requestNS(uuid) {
    this.loading = true;

    this.commonService
      .getOneNetworkService("sm", uuid)
      .then(response => {
        this.loading = false;
        this.detail = response;
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
        this.close();
      });
  }

  instantiate() {
    this.instantiateDialog.open(NsInstantiateDialogComponent, {
      data: {
        serviceUUID: this.detail["serviceID"],
        name: this.detail["name"]
      }
    });
  }

  close() {
    this.router.navigate(["service-management/network-services"]);
  }
}
