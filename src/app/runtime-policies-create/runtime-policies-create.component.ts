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
      .catch(err => (this.loading = false));
  }

  receiveNS(ns) {
    const ns_uuid = this.nsListComplete.filter(x => x.serviceName === ns)[0]
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

        // Save complete data from SLA
        this.slaListComplete = response;
      })
      .catch(err => (this.loading = false));
  }

  receiveSLA(sla) {
    const sla_uuid = this.slaListComplete.filter(x => x.name === sla)[0].uuid;
    this.policyForm.controls.sla.setValue(sla_uuid);
  }

  createPolicy() {}

  close() {
    this.router.navigate(["service-platform/policies/runtime-policies"]);
  }
}
