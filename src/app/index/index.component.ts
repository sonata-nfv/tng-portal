import { Component, OnInit } from "@angular/core";

import { CommonService } from "../shared/services/common/common.service";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"]
})
export class IndexComponent implements OnInit {
  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.commonService.getVimsRequestUUID();
  }
}
