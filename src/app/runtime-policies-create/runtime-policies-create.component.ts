import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-runtime-policies-create",
  templateUrl: "./runtime-policies-create.component.html",
  styleUrls: ["./runtime-policies-create.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesCreateComponent implements OnInit {
  loading: boolean = false;
  policyForm: FormGroup;
  disabledButton: boolean = true;
  closed: boolean = true;
  nsList = new Array();
  slaList = new Array();
  monitoringRules: string = "This is a monitoring rule for this example!";

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.policyForm = new FormGroup({
      name: new FormControl(),
      default: new FormControl(),
      ns: new FormControl(),
      sla: new FormControl(),
      monitoringRule: new FormControl()
    });

    this.nsList = ["ns1", "ns2"];
    this.slaList = ["sla1", "sla2"];
  }

  receiveNS(ns) {}

  receiveSLA(sla) {}

  createPolicy() {}

  close() {
    this.router.navigate(["service-platform/policies/runtime-policies"]);
  }
}
