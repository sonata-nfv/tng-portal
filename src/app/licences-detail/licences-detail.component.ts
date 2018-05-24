import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DataTransferService } from "../shared/services/service-management/dataTransfer.service";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";

@Component({
  selector: "app-licences-detail",
  templateUrl: "./licences-detail.component.html",
  styleUrls: ["./licences-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LicencesDetailComponent implements OnInit {
  status: string;
  licenceId: string;
  relatedService: string;
  type: string;
  description: string;

  constructor(
    private dataTransfer: DataTransferService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.dataTransfer.data.subscribe(res => {
      this.licenceId = res.licenceId;
      this.relatedService = res.relatedService;
      this.type = res.type;
      this.description = res.description;
    });
  }

  buy() {}

  close() {
    this.router.navigate(["service-management/licences"]);
  }
}
