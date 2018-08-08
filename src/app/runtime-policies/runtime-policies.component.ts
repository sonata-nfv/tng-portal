import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material";

import { CommonService } from "../shared/services/common/common.service";
import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { RuntimePolicyBindDialogComponent } from "../runtime-policy-bind-dialog/runtime-policy-bind-dialog.component";

@Component({
  selector: "app-runtime-policies",
  templateUrl: "./runtime-policies.component.html",
  styleUrls: ["./runtime-policies.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesComponent implements OnInit, OnDestroy {
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
    "enforced",
    "default",
    "delete"
  ];
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private servicePlatformService: ServicePlatformService,
    private instantiateDialog: MatDialog
  ) {}

  ngOnInit() {
    this.requestRuntimePolicies();

    // Reloads the template list every when children are closed
    this.subscription = this.router.events.subscribe(event => {
      if (
        event instanceof NavigationEnd &&
        event.url === "/service-platform/policies/runtime-policies" &&
        this.route.url["value"].length === 3 &&
        this.route.url["value"][2].path === "runtime-policies"
      ) {
        this.requestRuntimePolicies();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

        this.policies.forEach(policy => {
          policy.ns =
            this.nsListComplete.find(ns => ns.serviceId == policy.ns)
              .serviceName || policy.ns;
        });

        this.policiesDisplayed = this.sortPolicies(this.policies);
      })
      .catch(err => (this.loading = false));
  }

  setDefaultPolicy(uuid) {
    const policy = this.policies.find(x => x.uuid === uuid);
    const previousPolicy = this.policies.find(
      x => x.ns_uuid === policy.ns_uuid && x.default == true
    );

    // Set this policy to be the default one and false the previous
    this.loading = true;
    this.servicePlatformService
      .patchRuntimePolicy(policy.uuid, null, !policy.default, policy.ns_uuid) //sla
      .then(response => {
        this.loading = false;

        // Mark only one policy for ns
        this.policies
          .filter(x => x.ns_uuid === policy.ns_uuid && x.uuid !== uuid)
          .forEach(x => (x.default = false));
        this.policies.find(
          x => x.uuid === policy.uuid
        ).default = !policy.default;

        this.policiesDisplayed = this.sortPolicies(this.policies);
      })
      .catch(err => {
        this.loading = false;
      });
  }

  sortPolicies(policies) {
    return policies.sort((a, b) => {
      const keyA = a.default;
      const keyB = b.default;

      if (keyA > keyB) return -1;
      if (keyA < keyB) return 1;
      return 0;
    });
  }

  receiveNS(ns) {
    if (ns === "None") {
      this.policiesDisplayed = this.policies;
    } else {
      this.policiesDisplayed = this.policies.filter(x => x.ns === ns);
    }
  }

  deletePolicy(policy) {
    this.loading = true;

    this.servicePlatformService
      .deleteOneRuntimePolicy(policy.uuid)
      .then(response => {
        this.requestRuntimePolicies();
      })
      .catch(err => {
        this.loading = false;
        // TODO display request status in toast
      });
  }

  openPolicy(policy) {
    // this.router.navigate(["detail", policy.uuid], { relativeTo: this.route }); //TODO WHEN POLICY DETAIL WORKS
    this.instantiateDialog.open(RuntimePolicyBindDialogComponent, {
      data: { uuid: policy.uuid, serviceUUID: policy.ns_uuid }
    });
  }

  createNew() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }
}
