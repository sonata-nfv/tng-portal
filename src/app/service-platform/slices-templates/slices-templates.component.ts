import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";

import { ServicePlatformService } from "../service-platform.service";
import { CommonService } from "../../shared/services/common/common.service";

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
  displayedColumns = [
    "vendor",
    "name",
    "version",
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
    private commonService: CommonService,
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
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
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
        this.commonService.openSnackBar("Template deleted", "");
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
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
