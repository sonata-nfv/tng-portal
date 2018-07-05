import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-slices-instances-create",
  templateUrl: "./slices-instances-create.component.html",
  styleUrls: ["./slices-instances-create.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlicesInstancesCreateComponent implements OnInit {
  loading: boolean;
  instantiationForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SlicesInstancesCreateComponent>,
    private servicePlatformService: ServicePlatformService
  ) {}

  ngOnInit() {
    this.instantiationForm = new FormGroup({
      nsiName: new FormControl(null, Validators.required),
      nsiDescription: new FormControl(null, Validators.required)
    });
  }

  instantiate() {
    this.loading = true;

    const instance = {
      nstId: this.data.nstId,
      nsiName: this.instantiationForm.get("nsiName").value,
      nsiDescription: this.instantiationForm.get("nsiDescription").value
    };

    this.servicePlatformService
      .postOneSliceInstance(instance)
      .then(response => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.close();
      });
    // set loading to false when response received
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
