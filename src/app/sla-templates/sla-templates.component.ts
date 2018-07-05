import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { CommonService } from "../shared/services/common/common.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";
import { Subscriber, Subscription } from "rxjs";

@Component({
  selector: "app-sla-templates",
  templateUrl: "./sla-templates.component.html",
  styleUrls: ["./sla-templates.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlaTemplatesComponent implements OnInit, OnDestroy {
  loading: boolean;
  templates = new Array();
  dataSource = new MatTableDataSource();
  displayedColumns = ["status", "name", "ID", "ns", "expirationDate", "delete"];
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private commonService: CommonService,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.requestTemplates();

    // Reloads the template list every when children are closed
    this.subscription = this.router.events.subscribe(event => {
      if (
        event instanceof NavigationEnd &&
        event.url === "/service-platform/slas/sla-templates" &&
        this.route.url["value"].length === 3 &&
        this.route.url["value"][2].path === "sla-templates"
      ) {
        this.requestTemplates();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

    this.commonService
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
        } else {
          console.error("There was an error in the template creation");
        }
      });
  }

  deleteTemplate(uuid) {
    this.loading = true;

    this.servicePlatformService
      .deleteOneSLATemplate(uuid)
      .then(response => {
        this.requestTemplates();
      })
      .catch(err => {
        this.loading = false;
        // TODO display request status in toast
      });
  }

  createNew() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  openTemplate(row) {
    let uuid = row.uuid;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
