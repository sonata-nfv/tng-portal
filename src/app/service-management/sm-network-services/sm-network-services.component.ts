import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";

import { NsInstantiateDialogComponent } from "../ns-instantiate-dialog/ns-instantiate-dialog.component";

import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-sm-network-services",
  templateUrl: "./sm-network-services.component.html",
  styleUrls: ["./sm-network-services.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SmNetworkServicesComponent implements OnInit {
  loading: boolean;
  section: string;
  networkServices: Array<Object>;
  displayedColumns = [
    "Vendor",
    "Name",
    "Version",
    "Status",
    "Licenses",
    "SLAs",
    "instantiate"
  ];

  constructor(
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private instantiateDialog: MatDialog
  ) {}

  ngOnInit() {
    this.section = this.route.url["value"][0].path
      .replace(/-/g, " ")
      .toUpperCase();

    this.requestServices();
  }

  searchFieldData(search) {
    this.requestServices(search);
  }

  /**
   * Generates the HTTP request to get the list of NS.
   *
   * @param search [Optional] Network Service attributes that
   *                          must be matched by the returned
   *                          list of NS.
   */
  requestServices(search?) {
    this.loading = true;
    this.commonService
      .getNetworkServices(this.section, search)
      .then(response => {
        this.loading = false;
        this.networkServices = response;
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
      });
  }

  openNetworkService(row) {
    let uuid = row.serviceId;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }

  instantiate(row) {
    this.instantiateDialog.open(NsInstantiateDialogComponent, {
      data: { serviceUUID: row.serviceId, name: row.name }
    });
  }
}
