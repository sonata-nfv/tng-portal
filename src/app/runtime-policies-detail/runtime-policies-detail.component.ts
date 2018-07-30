import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { FormGroup, FormControl } from "@angular/forms";
import { CommonService } from "../shared/services/common/common.service";

@Component({
  selector: "app-runtime-policies-detail",
  templateUrl: "./runtime-policies-detail.component.html",
  styleUrls: ["./runtime-policies-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RuntimePoliciesDetailComponent implements OnInit {
  loading: boolean = false;
  closed: boolean = true;
  policyForm: FormGroup;
  nsList = new Array();
  nsListComplete = new Array();
  slaList = new Array();
  slaListComplete = new Array();
  detail = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestRuntimePolicy(uuid);
    });

    this.policyForm = new FormGroup({
      name: new FormControl(),
      default: new FormControl(),
      ns: new FormControl(),
      sla: new FormControl(),
      monitoringRule: new FormControl()
    });

    this.policyForm.valueChanges.subscribe(value => this._onFormChanges(value));
  }

  private _onFormChanges(value?) {
    // if (
    //   this.policyForm.get("ns").value != null &&
    //   this.policyForm.get("name").value != null
    // ) {
    // }
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
        this.policyForm.get("default").setValue(this.detail["default"]);
      })
      .catch(err => {
        this.loading = false;
      });
  }

  requestNetworkServices() {
    return new Promise((resolve, reject) => {
      this.commonService
        .getNetworkServices()
        .then(response => {
          // Save NS data to display
          this.nsList = response.map(x => x.serviceName);

          // Save complete data from NS
          this.nsListComplete = response;

          const nsName =
            this.nsListComplete.find(x => x.serviceId === this.detail["nsUUID"])
              .serviceName || this.detail["nsUUID"];

          this.policyForm.get("ns").setValue(nsName);
          resolve();
        })
        .catch(err => {
          this.nsList.push("None", this.detail["nsUUID"]);
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

          if (this.slaList.length < 1) {
            this.slaList.push("None", this.detail["sla"]);
          }

          // Save complete data from SLA
          this.slaListComplete = response;

          if (this.detail["sla"]) {
            const slaName =
              this.slaListComplete.find(x => x.uuid === this.detail["sla"])
                .name || this.detail["sla"];
            this.policyForm.get("sla").setValue(slaName);
          }
          resolve();
        })
        .catch(err => {
          this.slaList.push("None");
          reject();
        });
    });
  }

  editPolicy() {}

  close() {
    this.router.navigate(["service-platform/policies/runtime-policies"]);
  }
}
