import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonService } from "../shared/services/common/common.service";
import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";

@Component({
  selector: "app-runtime-policies-create",
  templateUrl: "./runtime-policies-create.component.html",
  styleUrls: ["./runtime-policies-create.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesCreateComponent implements OnInit {
  loading: boolean = false;
  reset: boolean = false;
  policyForm: FormGroup;
  disabledButton: boolean = true;
  closed: boolean = true;
  nsList = new Array();
  nsListComplete = new Array();
  monitoringRules: string = "This is a monitoring rule for this example!";

  constructor(
    private router: Router,
    private commonService: CommonService,
    private servicePlatformService: ServicePlatformService
  ) {}

  ngOnInit() {
    this.policyForm = new FormGroup({
      name: new FormControl(),
      default: new FormControl(),
      ns: new FormControl(null, Validators.required),
      monitoringRule: new FormControl()
    });

    this.policyForm.valueChanges.subscribe(value => this._onFormChanges(value));

    this.loading = true;
    this.commonService
      .getNetworkServices()
      .then(response => {
        this.loading = false;

        // Save NS data to display
        this.nsList = response.map(x => x.serviceName);

        // Save complete data from NS
        this.nsListComplete = response;
      })
      .catch(err => {
        this.loading = false;

        this.nsList.push("None");
      });
  }

  private _onFormChanges(value?) {
    if (
      this.policyForm.get("ns").value != null &&
      this.policyForm.get("name").value != null
    ) {
      this.disabledButton = false;
    }

    // Check optional default, add monitoring rules
  }

  receiveNS(ns) {
    let ns_uuid: string;

    if (ns === "None") {
      this.policyForm.controls.ns.setValue(null);
      ns_uuid = null;
    } else {
      ns_uuid = this.nsListComplete.filter(x => x.serviceName === ns)[0]
        .serviceId;
      this.policyForm.controls.ns.setValue(ns_uuid);
    }
  }

  createPolicy() {
    const policy = {
      vendor: "5GTANGO",
      name: this.policyForm.get("name").value,
      version: "0.1",
      network_service: this.policyForm.get("ns").value,
      default_policy: this.policyForm.get("default").value,
      policyRules: [],
      monitoringRules: this.policyForm.get("monitoringRule").value
    };

    this.loading = true;
    this.servicePlatformService
      .postOneRuntimePolicy(policy)
      .then(response => {
        this.loading = false;
        this.close();
      })
      .catch(err => {
        this.loading = false;
        // TODO display request status in toast
      });
  }

  close() {
    this.router.navigate(["service-platform/policies/runtime-policies"]);
  }
}
