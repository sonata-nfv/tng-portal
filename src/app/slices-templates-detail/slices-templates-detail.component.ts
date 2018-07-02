import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-slices-templates-detail",
  templateUrl: "./slices-templates-detail.component.html",
  styleUrls: ["./slices-templates-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlicesTemplatesDetailComponent implements OnInit {
  loading: boolean;

  uuid: string;
  name: string;
  author: string;
  version: string;
  createdAt: string;
  // templateForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    // this.templateForm = new FormGroup({
    //   ns: new FormControl(),
    //   guarantee: new FormControl()
    // });

    this.route.params.subscribe(params => {
      this.uuid = params["id"];
      this.requestSlicesTemplate(this.uuid);
    });
  }

  /**
   * Generates the HTTP request of a Slices Template by UUID.
   *
   * @param uuid ID of the selected template to be displayed.
   *             Comming from the route.
   */
  requestSlicesTemplate(uuid) {
    this.loading = true;

    this.servicePlatformService
      .getOneSliceTemplate(uuid)
      .then(response => {
        this.loading = false;

        this.name = response.name;
        this.author = response.author;
        this.createdAt = response.createdAt;
        this.version = response.version;
        this.createdAt = response.createdAt;
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

  deleteTemplate(uuid) {
    this.loading = true;
    this.servicePlatformService
      .deleteOneSlicesTemplate(uuid)
      .then(response => {
        this.close();
      })
      .catch(err => {
        this.loading = false;
        this.close();
        // TODO display request status in toast
      });
  }

  close() {
    this.router.navigate(["service-platform/slices/slices-templates"]);
  }
}
