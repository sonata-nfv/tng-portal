import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-sla-agreements-detail",
  templateUrl: "./sla-agreements-detail.component.html",
  styleUrls: ["./sla-agreements-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlaAgreementsDetailComponent implements OnInit {
  loading: boolean;
  agreementForm: FormGroup;

  name: string;
  author: string;
  date: string;
  ns: string;
  customer: string;
  propertyList: Array<Object>;
  availability: string;
  cost: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestSLAAgreement(uuid);
    });
  }

  /**
   * Generates the HTTP request of a SLA Agreement by UUID.
   *
   * @param uuid ID of the selected agreement to be displayed.
   *             Comming from the route.
   */
  requestSLAAgreement(uuid) {
    this.loading = true;

    this.servicePlatformService
      .getOneSLAAgreement(uuid)
      .then(response => {
        this.loading = false;

        this.name = response.name;
        this.author = response.author;
        this.date = response.date;
        this.ns = response.ns;
        this.customer = response.customer;
        this.propertyList = response.propertyList;
        this.availability = response.availability;
        this.cost = response.cost;
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

  close() {
    this.router.navigate(["service-platform/slas/sla-agreements"]);
  }
}
