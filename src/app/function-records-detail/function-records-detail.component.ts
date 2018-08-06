import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";

@Component({
  selector: "app-function-records-detail",
  templateUrl: "./function-records-detail.component.html",
  styleUrls: ["./function-records-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FunctionRecordsDetailComponent implements OnInit {
  _virtualLinks: Array<any>;
  _vdus: Array<any>;
  displayedColumnsConnPoints = [
    "id",
    "connectivity_type",
    "connection_points_reference"
  ];
  displayedColumnsVDUs = [
    "vduRef",
    "numInstances",
    "monitoringParam",
    "resourceReq",
    "vnfcInstance"
  ];

  /**
   * [Mandatory] Defines the virtual links displayed in the table.
   */
  @Input()
  set virtualLinks(virtualLinks: Array<string>) {
    this._virtualLinks = virtualLinks;
  }

  /**
   * [Mandatory] Defines the VDUs displayed in the table.
   */
  @Input()
  set vdus(vdus: Array<string>) {
    this._vdus = vdus;
  }

  constructor() {}

  ngOnInit() {}
}
