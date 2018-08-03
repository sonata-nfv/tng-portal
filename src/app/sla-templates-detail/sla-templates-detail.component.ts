import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-sla-templates-detail",
  templateUrl: "./sla-templates-detail.component.html",
  styleUrls: ["./sla-templates-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlaTemplatesDetailComponent implements OnInit {
  loading: boolean;
  detail = {};
  templateForm: FormGroup;
  closed: boolean = false;
  listNS = new Array();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.templateForm = new FormGroup({
      ns: new FormControl(),
      guarantee: new FormControl()
    });

    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestSLATemplate(uuid);
    });
  }

  /**
   * Generates the HTTP request of a SLA Template by UUID.
   *
   * @param uuid ID of the selected template to be displayed.
   *             Comming from the route.
   */
  requestSLATemplate(uuid) {
    this.loading = true;

    this.servicePlatformService
      .getOneSLATemplate(uuid)
      .then(response => {
        this.loading = false;
        this.detail = response;

        this.listNS = [response.ns];
        this.templateForm.controls.ns.setValue(response.ns);
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
          this.close();
        }
      });
  }

  receiveNS($event) {}

  receiveGuarantee($event) {}

  receiveDate($event) {}

  deleteTemplate() {
    this.loading = true;

    this.servicePlatformService
      .deleteOneSLATemplate(this.detail["uuid"])
      .then(response => {
        this.loading = false;
        this.close();
      })
      .catch(err => {
        this.loading = false;
        this.close();
        // TODO display request status in toast
      });
  }

  close() {
    this.router.navigate(["service-platform/slas/sla-templates"]);
  }
}
