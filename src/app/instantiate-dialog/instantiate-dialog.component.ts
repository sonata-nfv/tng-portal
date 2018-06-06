import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { ServiceManagementService } from "../shared/services/service-management/service-management.service";
import { CommonService } from "../shared/services/common/common.service";

@Component({
  selector: "app-instantiate-dialog",
  templateUrl: "./instantiate-dialog.component.html",
  styleUrls: ["./instantiate-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class InstantiateDialogComponent implements OnInit {
  loading: boolean;
  instantiationForm: FormGroup;
  reset: boolean = false;
  isIngress: boolean = true;
  ingress = new Array();
  egress = new Array();
  locations = new Array();

  constructor(
    private commonService: CommonService,
    public dialogRef: MatDialogRef<InstantiateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceManagementService: ServiceManagementService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.instantiationForm = new FormGroup({
      location: new FormControl(null, Validators.required),
      nap: new FormControl()
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
  }

  addNew(instantiationForm: FormGroup) {
    if (this.isIngress) {
      this.ingress.push({
        location: instantiationForm.controls.location.value,
        nap: instantiationForm.controls.nap.value
      });
    } else {
      this.egress.push({
        location: instantiationForm.controls.location.value,
        nap: instantiationForm.controls.nap.value
      });
    }
    this.instantiationForm.reset();
    this.reset = true;
    setTimeout(() => {
      this.reset = false;
    }, 5);
  }

  eraseEntry(entry: string) {
    if (this.isIngress) {
      this.ingress = this.ingress.filter(x => x !== entry);
    } else {
      this.egress = this.egress.filter(x => x !== entry);
    }
  }

  private receiveLocation($event) {
    this.instantiationForm.controls.location.setValue($event);
  }

  instantiate(service) {
    this.serviceManagementService.postNSRequest(
      service,
      this.ingress,
      this.egress
    );
  }
}
