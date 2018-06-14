import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-sla-agreements",
  templateUrl: "./sla-agreements.component.html",
  styleUrls: ["./sla-agreements.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlaAgreementsComponent implements OnInit {
  loading: boolean;
  agreements = new Array();
  dataSource = new MatTableDataSource();
  displayedColumns = ["status", "name", "ns", "customer", "date"];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.requestAgreements();
  }

  searchFieldData(search) {
    this.requestAgreements(search);
  }

  /**
   * Generates the HTTP request to get the list of SLA agreements.
   *
   * @param search [Optional] SLA agreement attributes that
   *                          must be matched by the returned
   *                          list of agreements.
   */
  requestAgreements(search?) {
    this.loading = true;
    this.servicePlatformService
      .getSLAAgreements(search)
      .then(response => {
        this.loading = false;

        this.agreements = response;
        this.dataSource = new MatTableDataSource(this.agreements);
      })
      .catch(err => {
        this.loading = false;

        // Dialog informing the user to log in again when token expired
        if (err === "Unauthorized") {
          let title = "Your session has expired";
          let content =
            "Please, LOG IN again because your access token has expired.";
          let action = "Log in";

          this.dialogData.openDialog(title, content, action, () => {
            this.router.navigate(["/login"]);
          });
        }
      });
  }

  openAgreement(row) {
    let uuid = row.uuid;
    // this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
