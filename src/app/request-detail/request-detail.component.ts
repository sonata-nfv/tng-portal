import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { DataTransferService } from "../shared/services/serviceManagement/dataTransfer.service";

import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-request-detail",
  templateUrl: "./request-detail.component.html",
  styleUrls: ["./request-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RequestDetailComponent implements OnInit {
  detail: Object;

  constructor(
    private dataTransfer: DataTransferService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.dataTransfer.data.subscribe(res => (this.detail = res));
  }

  close() {
    this.router.navigate(["/requests"]);
  }
}
