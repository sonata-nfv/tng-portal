import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { DataTransferService } from "../shared/services/service-management/dataTransfer.service";

import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-request-detail",
  templateUrl: "./request-detail.component.html",
  styleUrls: ["./request-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RequestDetailComponent implements OnInit {
  requestId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  serviceId: string;
  status: string;

  constructor(
    private dataTransfer: DataTransferService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.dataTransfer.data.subscribe(res => {
      this.requestId = res.requestId;
      this.type = res.type;
      this.createdAt = res.createdAt;
      this.updatedAt = res.updatedAt;
      this.serviceId = res.serviceId;
      this.status = res.status;
    });
  }

  close() {
    this.router.navigate(["/requests"]);
  }
}
