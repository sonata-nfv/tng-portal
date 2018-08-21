import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";

import { ServicePlatformService } from "../service-platform.service";
import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-runtime-policies-detail",
  templateUrl: "./runtime-policies-detail.component.html",
  styleUrls: ["./runtime-policies-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesDetailComponent implements OnInit {
  loading: boolean = false;
  section: string;
  closed: boolean = true;
  nsName: string;
  slaName: string;
  policyForm: FormGroup;
  nsList = new Array();
  nsListComplete = new Array();
  slaList = new Array();
  slaListComplete = new Array();
  detail = {};
  defaultPolicy: boolean;
  monitoringRules: string = "This is a monitoring rule for this example!";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.section = this.route.url["value"][0].path
      .replace(/-/g, " ")
      .toUpperCase();

    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestRuntimePolicy(uuid);
    });

    this.policyForm = new FormGroup({
      ns: new FormControl(),
      sla: new FormControl(),
      monitoringRule: new FormControl()
    });
  }

  /**
   * Generates the HTTP request of a Runtime Policy by UUID.
   *
   * @param uuid ID of the selected runtime policy to be displayed.
   *             Comming from the route.
   */
  requestRuntimePolicy(uuid) {
    this.loading = true;

    this.servicePlatformService
      .getOneRuntimePolicy(uuid)
      .then(response => {
        this.detail = response;

        Promise.all([
          this.requestNetworkServices(),
          this.requestSLAs(this.detail["nsUUID"])
        ])
          .then(responses => {
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });

        this.policyForm.get("name").setValue(this.detail["name"]);
        this.defaultPolicy = this.detail["default"];
      })
      .catch(err => {
        this.loading = false;
      });
  }

  requestNetworkServices() {
    return new Promise((resolve, reject) => {
      this.commonService
        .getNetworkServices(this.section)
        .then(response => {
          // Save NS data to display
          this.nsList = response.map(x => x.name);

          // Save complete data from NS
          this.nsListComplete = response;

          if (
            this.nsListComplete.find(x => x.serviceId === this.detail["nsUUID"])
          ) {
            this.nsName = this.nsListComplete.find(
              x => x.serviceId === this.detail["nsUUID"]
            ).name;
          } else {
            this.nsList.push(this.detail["nsUUID"]);
            this.nsName = this.detail["nsUUID"];
          }

          this.policyForm.get("ns").setValue(this.detail["nsUUID"]);

          resolve();
        })
        .catch(err => {
          this.nsList.unshift("None", this.detail["nsUUID"]);
          this.policyForm.get("ns").setValue(this.detail["nsUUID"]);
          reject();
        });
    });
  }

  requestSLAs(ns_uuid) {
    return new Promise((resolve, reject) => {
      this.commonService
        .getSLATemplates()
        .then(response => {
          // Save SLA data to display
          this.slaList = response
            .filter(x => x.nsUUID === ns_uuid)
            .map(x => x.name);

          // Save complete data from SLA
          this.slaListComplete = response;

          if (
            this.detail["sla"] &&
            this.slaListComplete.find(x => x.uuid === this.detail["sla"])
          ) {
            this.slaName = this.slaListComplete.find(
              x => x.uuid === this.detail["sla"]
            ).name;
            this.policyForm.get("sla").setValue(this.detail["sla"]);
          } else if (this.detail["sla"]) {
            this.slaList.push(this.detail["sla"]);
            this.slaName = this.detail["sla"];
            this.policyForm.get("sla").setValue(this.detail["sla"]);
          }

          this.slaList.unshift("None");

          resolve();
        })
        .catch(err => {
          this.slaList.unshift("None");
          reject();
        });
    });
  }

  receiveNS(ns) {
    if (ns === "None") {
      this.policyForm.controls.ns.setValue(null);
    } else if (this.nsListComplete.find(x => x.name === ns)) {
      const ns_uuid = this.nsListComplete.find(x => x.name === ns).serviceId;
      this.policyForm.controls.ns.setValue(ns_uuid);
    } else {
      this.policyForm.controls.ns.setValue(ns);
    }

    if (ns != this.nsName) {
      this.policyForm.markAsTouched();
    }
  }

  receiveSLA(sla) {
    if (sla !== "None") {
      const sla_uuid = this.slaListComplete.find(x => x.name === sla).uuid;
      this.policyForm.get("sla").setValue(sla_uuid);
    } else {
      this.policyForm.get("sla").setValue(null);
    }

    if (sla != this.slaName) {
      this.policyForm.markAsTouched();
    }
  }

  setDefaultPolicy(value) {
    this.loading = true;
    this.servicePlatformService
      .setDefaultRuntimePolicy(this.detail["uuid"], value)
      .then(response => {
        this.loading = false;
        this.defaultPolicy = value;
      })
      .catch(err => {
        this.loading = false;
      });
  }

  editPolicy() {
    console.log(this.policyForm.controls);
  }

  close() {
    this.router.navigate(["service-platform/policies/runtime-policies"]);
  }
}
