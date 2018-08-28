import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { ServiceManagementService } from "../service-management.service";
import { CommonService } from "../../shared/services/common/common.service";

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
  slasWithUUID = new Array();

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
      sla: new FormControl(),
      instanceName: new FormControl()
    });

    // TODO request to 5GTANGO endpoint the actual vim_cities
    this.locations = this.commonService.requestVims();

    this.commonService
      .getSLATemplates()
      .then(response => {
        this.loading = false;

        this.slas = response
          .filter(x => x.nsUUID === this.data.serviceUUID)
          .map(x => x.name);
        this.slas.unshift("None");

        this.slasWithUUID = response.filter(
          x => x.nsUUID === this.data.serviceUUID
        );
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
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
    if (sla != "None") {
      this.instantiationForm.controls.sla.setValue(sla);
    }
  }

  instantiate(serviceUUID) {
    this.serviceManagementService
      .postNSRequest(
        this.instantiationForm.get("instanceName").value,
        serviceUUID,
        this.ingress,
        this.egress,
        this.slasWithUUID
          .filter(x => x.name === this.instantiationForm.controls.sla.value)
          .map(x => x.uuid)[0]
      )
      .then(response => {
        this.commonService.openSnackBar(
          "Instantiating " + response + "...",
          ""
        );
        this.close();
      })
      .catch(err => {
        this.commonService.openSnackBar(err, "");
        this.close();
      });
  }

  close() {
    this.dialogRef.close();
  }
}
