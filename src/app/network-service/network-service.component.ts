import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material";

import { InstantiateDialogComponent } from "../instantiate-dialog/instantiate-dialog.component";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";

@Component({
  selector: "app-network-service",
  templateUrl: "./network-service.component.html",
  styleUrls: ["./network-service.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NetworkServiceComponent implements OnInit {
  name: string;
  author: string;
  version: string;
  vendor: string;
  serviceID: string;
  type: string;
  description: string;

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private instantiateDialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];

      this.serviceManagementService
        .getNetworkService(uuid)
        .then(response => {
          this.name = response.nsd.name;
          this.author = response.nsd.author;
          this.version = response.nsd.version;
          this.vendor = response.nsd.vendor;
          this.serviceID = response.uuid;
          this.type = response.user_licence;
          this.description = response.nsd.description;
          return;
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  instanciate() {
    this.instantiateDialog.open(InstantiateDialogComponent, {
      data: {
        service: {
          serviceId: this.serviceID,
          serviceName: this.name
        }
      }
    });
  }

  close() {
    this.router.navigate(["/available-network-services"]);
  }
}
