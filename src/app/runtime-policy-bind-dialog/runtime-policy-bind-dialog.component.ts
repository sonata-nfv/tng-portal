import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { CommonService } from "../shared/services/common/common.service";
import { FormGroup, FormControl } from "@angular/forms";
import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";

@Component({
  selector: "app-runtime-policy-bind-dialog",
  templateUrl: "./runtime-policy-bind-dialog.component.html",
  styleUrls: ["./runtime-policy-bind-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class RuntimePolicyBindDialogComponent implements OnInit {
  loading: boolean = false;
  slas = new Array();
  slasComplete = new Array();
  bindingForm: FormGroup;

  constructor(
    private commonService: CommonService,
    private servicePlatformService: ServicePlatformService,
    public dialogRef: MatDialogRef<RuntimePolicyBindDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.loading = true;

    this.bindingForm = new FormGroup({
      sla: new FormControl()
    });

    this.commonService
      .getSLATemplates()
      .then(response => {
        this.loading = false;

        this.slas = response
          .filter(x => x.nsUUID === this.data.serviceUUID)
          .map(x => x.name);

        this.slasComplete = response.filter(
          x => x.nsUUID === this.data.serviceUUID
        );
      })
      .catch(err => {
        this.loading = false;
      });
  }

  receiveSLA(sla) {
    const uuid = this.slasComplete.find(x => x.name == sla).nsUUID;
    this.bindingForm.controls.sla.setValue(uuid);
  }

  bindPolicy() {
    this.loading = true;
    this.servicePlatformService
      .patchRuntimePolicy(
        this.data.uuid,
        this.bindingForm.get("sla").value,
        true,
        this.data.serviceUUID
      )
      .then(response => {
        this.loading = false;
        this.close();
      })
      .catch(err => {
        this.loading = false;
        this.close();
      });
  }

  close() {
    this.dialogRef.close();
  }
}
