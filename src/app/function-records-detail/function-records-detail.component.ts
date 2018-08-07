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
    virtualLinks != undefined
      ? (this._virtualLinks = virtualLinks)
      : (this._virtualLinks = new Array());
  }

  /**
   * [Mandatory] Defines the VDUs displayed in the table.
   */
  @Input()
  set vdus(vdus: Array<string>) {
    vdus != undefined ? (this._vdus = vdus) : (this._vdus = new Array());
  }

  constructor() {}

  ngOnInit() {}
}
