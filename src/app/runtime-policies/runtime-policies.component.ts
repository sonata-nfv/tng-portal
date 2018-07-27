import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material";

import { CommonService } from "../shared/services/common/common.service";
import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";

@Component({
  selector: "app-runtime-policies",
  templateUrl: "./runtime-policies.component.html",
  styleUrls: ["./runtime-policies.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesComponent implements OnInit {
  loading: boolean;
  reset: boolean;
  policiesDisplayed = new Array();
  policies = new Array();
  nsList = new Array();
  nsListComplete = new Array();
  displayedColumns = [
    "vendor",
    "name",
    "version",
    "ns",
    // "date",
    "enforced",
    "default",
    "delete"
  ];
  dataSource = new MatTableDataSource();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private servicePlatformService: ServicePlatformService
  ) {}

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
    this.loading = true;

    this.reset = true;
    setTimeout(() => {
      this.reset = false;
    }, 5);

    Promise.all([
      this.commonService.getNetworkServices(),
      this.servicePlatformService.getRuntimePolicies(search)
    ])
      .then(responses => {
        this.loading = false;

        // Save NS data to display
        this.nsList = responses[0].map(x => x.serviceName);
        this.nsList.unshift("None");

        // Save complete data from NS
        this.nsListComplete = responses[0];

        this.policies = responses[1];
        this.policiesDisplayed = responses[1];
        this.dataSource = new MatTableDataSource(this.policiesDisplayed);
      })
      .catch(err => (this.loading = false));
  }

  setDefaultPolicy(uuid) {
    // Check-uncheck button
    const policy = this.policies.find(x => x.uuid === uuid);
    this.policies
      .filter(x => x.ns_uuid === policy.ns_uuid && x.uuid !== uuid)
      .forEach(x => (x.default = false));

    this.policies.filter(
      x => x.uuid === policy.uuid
    )[0].default = !this.policies.filter(x => x.uuid === policy.uuid)[0]
      .default;

    // TODO request this policy to be default and false the previous

    this.policiesDisplayed = this.policies;

    // TODO order default = true in top
  }

  receiveNS(ns) {
    if (ns === "None") {
      this.policiesDisplayed = this.policies;
    } else {
      this.policiesDisplayed = this.policies.filter(x => x.ns_uuid === ns);
    }
  }

  deletePolicy(uuid) {
    this.loading = true;

    this.servicePlatformService
      .deleteOneRuntimePolicy(uuid)
      .then(response => {
        this.requestRuntimePolicies();
      })
      .catch(err => {
        this.loading = false;
        // TODO display request status in toast
      });
  }

  openPolicy(policy) {
    this.router.navigate(["detail", policy.uuid], { relativeTo: this.route });
  }

  createNew() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }
}
