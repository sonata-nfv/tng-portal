import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-runtime-policies",
  templateUrl: "./runtime-policies.component.html",
  styleUrls: ["./runtime-policies.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesComponent implements OnInit {
  loading: boolean;
  reset: boolean;
  nsList = new Array();

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.requestRuntimePolicies();
  }

  searchFieldData(search) {
    this.requestRuntimePolicies(search);
  }

  /**
   * Generates the HTTP request to get the list of Runtime Policies.
   *
   * @param search [Optional] Runtime Policy attributes that
   *                          must be matched by the returned
   *                          list of policies.
   */
  requestRuntimePolicies(search?) {
    this.nsList = ["A", "B"];
  }

  receiveNS(ns) {}

  createNew() {
    // this.router.navigate(["new"], { relativeTo: this.route });
  }
}
