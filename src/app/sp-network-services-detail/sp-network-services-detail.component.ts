import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { CommonService } from "../shared/services/common/common.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-sp-network-services-detail",
  templateUrl: "./sp-network-services-detail.component.html",
  styleUrls: ["./sp-network-services-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SpNetworkServicesDetailComponent implements OnInit {
  loading: boolean;

  name: string;
  author: string;
  version: string;
  status: string;
  vendor: string;
  serviceID: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    private commonService: CommonService,
    private dialogData: DialogDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestNetworkService(uuid);
    });
  }

  requestNetworkService(uuid) {
    this.loading = true;

    this.commonService
      .getOneNetworkService(uuid)
      .then(response => {
        this.loading = false;

        this.name = response.name;
        this.author = response.author;
        this.version = response.version;
        this.vendor = response.vendor;
        this.status = response.status;
        this.serviceID = response.serviceID;
        this.type = response.type;
        this.description = response.description;
        this.createdAt = response.createdAt;
        this.updatedAt = response.updatedAt;
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
    this.router.navigate(["service-platform/sp-network-services"]);
  }
}
