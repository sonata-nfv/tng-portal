import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";
import { Subscription } from "rxjs";
import { SlicesInstancesCreateComponent } from "../slices-instances-create/slices-instances-create.component";

@Component({
  selector: "app-slices-templates",
  templateUrl: "./slices-templates.component.html",
  styleUrls: ["./slices-templates.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlicesTemplatesComponent implements OnInit {
  loading: boolean;
  templates = new Array();
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "status",
    "name",
    "ID",
    "author",
    "usageState",
    "instantiate",
    "delete"
  ];
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService,
    private instantiateDialog: MatDialog
  ) {}

  ngOnInit() {
    this.requestTemplates();

    // Reloads the template list every when children are closed
    this.subscription = this.router.events.subscribe(event => {
      if (
        event instanceof NavigationEnd &&
        event.url === "/service-platform/slices/slices-templates" &&
        this.route.url["value"].length === 3 &&
        this.route.url["value"][2].path === "slices-templates"
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
   * Generates the HTTP request to get the list of Slices templates.
   *
   * @param search [Optional] Slices template attributes that
   *                          must be matched by the returned
   *                          list of templates.
   */
  requestTemplates(search?) {
    this.loading = true;

    this.servicePlatformService
      .getSlicesTemplates(search)
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

  instantiate(nst) {
    this.instantiateDialog.open(SlicesInstancesCreateComponent, {
      data: {
        nstId: nst.uuid,
        vendor: nst.vendor,
        name: nst.name,
        version: nst.version
      }
    });
  }

  deleteTemplate(uuid) {
    this.loading = true;
    this.servicePlatformService
      .deleteOneSlicesTemplate(uuid)
      .then(response => {
        this.requestTemplates();
      })
      .catch(err => {
        this.loading = false;
        // TODO display request status in toast
      });
  }

  openTemplate(row) {
    let uuid = row.uuid;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
