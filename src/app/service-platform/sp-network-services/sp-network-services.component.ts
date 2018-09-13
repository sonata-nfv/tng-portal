import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { CommonService } from "../../shared/services/common/common.service";
import { DialogDataService } from "../../shared/services/dialog/dialog.service";

@Component({
  selector: "app-sp-network-services",
  templateUrl: "./sp-network-services.component.html",
  styleUrls: ["./sp-network-services.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SpNetworkServicesComponent implements OnInit {
  loading: boolean;
  section: string;
  networkServices: Array<Object>;
  displayedColumns = ["Vendor", "Name", "Version", "Status"]; //"SLAs"

  constructor(
    private commonService: CommonService,
    private router: Router,
    private dialogData: DialogDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.requestServices();
  }

  searchFieldData(search) {
    this.section = this.route.url["value"][0].path
      .replace(/-/g, " ")
      .toUpperCase();
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
    this.router.navigate([uuid], { relativeTo: this.route });
  }
}
