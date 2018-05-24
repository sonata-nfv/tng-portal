import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";
import { NgForm } from "@angular/forms";

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
  isIngress = true;
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

  addNew(instantiationForm: NgForm) {
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
    instantiationForm.reset();
  }

  eraseEntry(entry: string) {
    if (this.isIngress) {
      this.ingress = this.ingress.filter(x => x !== entry);
    } else {
      this.egress = this.egress.filter(x => x !== entry);
    }
  }

  instantiate(service) {
    this.serviceManagementService.instantiate(
      service,
      this.ingress,
      this.egress
    );
  }
}
