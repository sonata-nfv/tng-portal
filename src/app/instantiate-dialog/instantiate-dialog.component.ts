import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";
import { NgForm } from "@angular/forms";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";

@Component({
  selector: "app-instantiate-dialog",
  templateUrl: "./instantiate-dialog.component.html",
  styleUrls: ["./instantiate-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class InstantiateDialogComponent implements OnInit {
  isIngress = true;
  ingress = new Array();
  egress = new Array();
  // TODO GET posible locations
  locations = ["Aveiro", "Barcelona"];

  constructor(
    public dialogRef: MatDialogRef<InstantiateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private instantiateDialog: ServiceManagementService
  ) {}

  ngOnInit() {}

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

  instantiate() {
    this.instantiateDialog.instantiate(this.ingress, this.egress);
  }
}
