import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "../shared/services/common/common.service";

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
  slaList = new Array();
  slaListComplete = new Array();
  monitoringRules: string = "This is a monitoring rule for this example!";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.policyForm = new FormGroup({
      name: new FormControl(),
      default: new FormControl(),
      ns: new FormControl(null, Validators.required),
      sla: new FormControl(),
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

  receiveNS(ns) {
    let ns_uuid: string;

    if (ns === "None") {
      this.policyForm.controls.ns.setValue(null);
      ns_uuid = null;
    } else {
      ns_uuid = this.nsListComplete.filter(x => x.serviceName === ns)[0]
        .serviceId;
      this.policyForm.controls.ns.setValue(ns_uuid);

      this.loading = true;
      this.commonService
        .getSLATemplates()
        .then(response => {
          this.loading = false;

          // Save SLA data to display
          this.slaList = response
            .filter(x => x.nsUUID === ns_uuid)
            .map(x => x.name);

          if (this.slaList.length < 1) {
            this.slaList.push("None");
          }

          // Save complete data from SLA
          this.slaListComplete = response;
        })
        .catch(err => {
          this.loading = false;

          this.slaList.push("None");
        });
    }
  }

  receiveSLA(sla) {
    if (sla !== "None") {
      const sla_uuid = this.slaListComplete.filter(x => x.name === sla)[0].uuid;
      this.policyForm.controls.sla.setValue(sla_uuid);
    } else {
      this.policyForm.controls.sla.setValue(null);
    }
  }

  private _onFormChanges(value?) {
    console.log(this.policyForm);
    if (
      this.policyForm.get("ns").value != null &&
      this.policyForm.get("name").value != null
    ) {
      this.disabledButton = false;
    }

    // Check optional default, sla, add monitoring rules
  }

  createPolicy() {
    const policy = {
      name: this.policyForm.get("name").value,
      ns: this.policyForm.get("ns").value,
      default: this.policyForm.get("default").value,
      sla: this.policyForm.get("sla").value,
      monitoringRule: this.policyForm.get("monitoringRule").value
    };

    console.log(policy);
  }

  close() {
    this.router.navigate(["service-platform/policies/runtime-policies"]);
  }
}
