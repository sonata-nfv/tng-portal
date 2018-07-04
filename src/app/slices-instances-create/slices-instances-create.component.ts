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
  instance = {};
  instantiationForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SlicesInstancesCreateComponent>,
    private servicePlatformService: ServicePlatformService
  ) {}

  ngOnInit() {
    console.log(this.data);

    // description: this.description,
    // name: this.name

    this.instantiationForm = new FormGroup({
      nsiName: new FormControl(null, Validators.required),
      nsiDescription: new FormControl(null, Validators.required)
    });
  }

  instantiate() {
    this.loading = true;
    this.servicePlatformService.postOneSliceInstance(this.instance);
    // set loading to false when response received
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
