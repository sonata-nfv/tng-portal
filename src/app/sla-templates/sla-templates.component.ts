import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-sla-templates",
  templateUrl: "./sla-templates.component.html",
  styleUrls: ["./sla-templates.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlaTemplatesComponent implements OnInit {
  loading: boolean;
  templates = new Array();
  dataSource = new MatTableDataSource();
  displayedColumns = ["status", "name", "ID", "ns", "expirationDate", "delete"];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.requestTemplates();
  }

  searchFieldData(search) {
    this.requestTemplates(search);
  }

  /**
   * Generates the HTTP request to get the list of SLA templates.
   *
   * @param search [Optional] SLA template attributes that
   *                          must be matched by the returned
   *                          list of templates.
   */
  requestTemplates(search?) {
    this.loading = true;
    this.servicePlatformService
      .getSLATemplates(search)
      .then(response => {
        this.loading = false;

        this.templates = response;
        this.dataSource = new MatTableDataSource(this.templates);
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

  remove(element) {
    // TODO send request to remove SLA from list
  }

  openTemplate(row) {
    let uuid = row.uuid;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
