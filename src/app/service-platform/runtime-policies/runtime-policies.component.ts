import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";

import { CommonService } from "../../shared/services/common/common.service";
import { ServicePlatformService } from "../service-platform.service";

@Component({
  selector: "app-runtime-policies",
  templateUrl: "./runtime-policies.component.html",
  styleUrls: ["./runtime-policies.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesComponent implements OnInit, OnDestroy {
  loading: boolean;
  section: string;
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
    private servicePlatformService: ServicePlatformService
  ) {}

  ngOnInit() {
    this.section = this.route.url["value"][0].path
      .replace(/-/g, " ")
      .toUpperCase();

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
      this.commonService.getNetworkServices(this.section),
      this.servicePlatformService.getRuntimePolicies(search)
    ])
      .then(responses => {
        this.loading = false;

        // Save NS data to display
        this.nsList = responses[0].map(x => x.name);
        this.nsList.unshift("None");

        // Save complete data from NS
        this.nsListComplete = responses[0];

        this.policies = responses[1];

        this.policies.forEach(policy => {
          policy.ns =
            this.nsListComplete.find(ns => ns.serviceId == policy.ns_uuid)
              .name || policy.ns;
        });

        this.policiesDisplayed = this.sortPolicies(this.policies);
      })
      .catch(err => {
        this.loading = false;
        // TODO message instead of table saying none was found
        this.commonService.openSnackBar(
          "There was an error while fetching the policies",
          ""
        );
      });
  }

  setDefaultPolicy(uuid) {
    const policy = this.policies.find(x => x.uuid === uuid);

    // Set this policy to be the default one and false the previous
    this.loading = true;
    this.servicePlatformService
      .setDefaultRuntimePolicy(policy.uuid, !policy.default)
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
        this.commonService.openSnackBar(response["message"], "");
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(
          "There was an error setting the policy as default!",
          ""
        );
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
        this.commonService.openSnackBar(response["message"], "");
        this.requestRuntimePolicies();
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(
          "There was an error while deleting the policy!",
          ""
        );
      });
  }

  openPolicy(policy) {
    this.router.navigate(["detail", policy.uuid], { relativeTo: this.route }); //TODO WHEN POLICY DETAIL WORKS
  }

  createNew() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }
}
