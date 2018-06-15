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
  date: string;
  templateForm: FormGroup;
  listNS = new Array();
  storedGuarantees: Array<Object>;
  guaranties: Array<Object>;
  closed: boolean = true;

  name: string;
  author: string;
  createdAt: string;
  expirationDate: string;
  ns: string;

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

    this.templateForm.valueChanges.subscribe(value =>
      this._onFormChanges(value)
    );

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

    // TODO request list of NS to display
    this.listNS = ["A", "B"];

    this.servicePlatformService
      .getOneSLATemplate(uuid)
      .then(response => {
        this.loading = false;

        this.name = response.name;
        this.author = response.author;
        this.createdAt = response.createdAt;
        this.expirationDate = response.expirationDate;
        this.templateForm.controls.ns.setValue(response.ns);
        this.storedGuarantees = response.storedGuarantees;
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

    // TODO request available guaranties for that NS
    this.guaranties = ["g1", "g2"];
  }

  private _onFormChanges(values) {
    // TODO NS search of ns changes
  }

  receiveNS($event) {
    this.templateForm.controls.ns.setValue($event);
    // TODO guarantees search according NS
  }

  receiveGuarantee($event) {
    this.templateForm.controls.guarantee.setValue($event);
  }

  receiveDate($event) {
    this.date = $event;
  }

  close() {
    this.router.navigate(["service-platform/slas/sla-templates"]);
  }
}
