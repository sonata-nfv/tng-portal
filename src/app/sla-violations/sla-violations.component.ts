import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-sla-violations",
  templateUrl: "./sla-violations.component.html",
  styleUrls: ["./sla-violations.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlaViolationsComponent implements OnInit {
  loading: boolean = false;
  violations = new Array();

  constructor() {}

  ngOnInit() {
    this.requestViolations();
  }

  searchFieldData(search) {
    this.requestViolations(search);
  }

  requestViolations(search?) {}
}
