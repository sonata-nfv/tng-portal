import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";
import { CommonService } from "../shared/services/common/common.service";

@Component({
  selector: "app-ns-instantiate-dialog",
  templateUrl: "./ns-instantiate-dialog.component.html",
  styleUrls: ["./ns-instantiate-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NsInstantiateDialogComponent implements OnInit {
  loading: boolean;
  continue: boolean = false;
  reset: boolean = false;
  isIngress: boolean = true;
  instantiationForm: FormGroup;
  ingress = new Array();
  egress = new Array();
  locations = new Array();
  slas = new Array();

  constructor(
    private commonService: CommonService,
    public dialogRef: MatDialogRef<NsInstantiateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceManagementService: ServiceManagementService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.instantiationForm = new FormGroup({
      location: new FormControl(null, Validators.required),
      nap: new FormControl(),
      sla: new FormControl()
    });

    setTimeout(() => {
      this.commonService
        .requestVims()
        .then(response => {
          this.loading = false;
          this.locations = response;
        })
        .catch(err => {
          this.loading = false;
        });
    }, 1000);

    this.commonService
      .getSLATemplates()
      .then(response => {
        this.loading = false;

        this.slas = response
          .filter(x => x.nsUUID === this.data.serviceUUID)
          .map(x => x.name);
      })
      .catch(err => {
        this.loading = false;
      });
  }

  /**
   * Saves the introduced ingress/egress points
   */
  addNew() {
    if (this.isIngress) {
      this.ingress.push({
        location: this.instantiationForm.controls.location.value,
        nap: this.instantiationForm.controls.nap.value
      });
    } else {
      this.egress.push({
        location: this.instantiationForm.controls.location.value,
        nap: this.instantiationForm.controls.nap.value
      });
    }
    this.instantiationForm.reset();
    this.reset = true;
    setTimeout(() => {
      this.reset = false;
    }, 5);
  }

  /**
   * Removes the selected ingress/egress point from the list
   *
   * @param entry Ingress or egress point selected
   */
  eraseEntry(entry: string) {
    if (this.isIngress) {
      this.ingress = this.ingress.filter(x => x !== entry);
    } else {
      this.egress = this.egress.filter(x => x !== entry);
    }
  }

  receiveLocation(location) {
    this.instantiationForm.controls.location.setValue(location);
  }

  receiveSLA(sla) {
    this.instantiationForm.controls.sla.setValue(sla);
  }

  instantiate(serviceUUID) {
    this.serviceManagementService.postNSRequest(
      serviceUUID,
      this.ingress,
      this.egress,
      this.instantiationForm.controls.sla.value
    );
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
