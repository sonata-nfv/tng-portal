import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from "@angular/core";
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
  // @ViewChild("radioButton", { read: ElementRef })
  // private elRadioButton: ElementRef;

  @ViewChild("defaultSelection") elDefaultSelection: ElementRef;

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
    "date",
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
    // Check-uncheck radio button
    this.policies.filter(
      x => x.uuid === uuid
    )[0].default = !this.policies.filter(x => x.uuid === uuid)[0].default;

    // console.log(this.policies.map(x => x.default));
    console.log(this.elDefaultSelection.nativeElement);
    // this.elRadioButton.nativeElement.style.backgroundColor = "cyan";

    // TODO request this policy to be default
  }

  receiveNS(ns) {
    if (ns === "None") {
      this.policiesDisplayed = this.policies;
    } else {
      this.policiesDisplayed = this.policies.filter(x => x.ns_uuid === ns);
    }
  }

  deletePolicy(uuid) {}

  openPolicy(policy) {}

  createNew() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }
}
