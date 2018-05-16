import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-placement-policy",
  templateUrl: "./placement-policy.component.html",
  styleUrls: ["./placement-policy.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PlacementPolicyComponent implements OnInit {
  placementPolicyForm: FormGroup;
  show: boolean = false;
  error: boolean;
  prioritise: boolean = false;

  // TODO GET placement policies from a service
  placementPolicies = ["None", "Load Balanced", "Prioritise", "Fill First"];
  datacenters = ["A", "B", "C"];
  datacentersSelected = new Array();

  constructor(private dialogData: DialogDataService) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.placementPolicyForm = new FormGroup({
      placementPolicy: new FormControl(),
      datacenter: new FormControl()
    });
    this.placementPolicyForm.valueChanges.subscribe(value =>
      this._onFormChanges(value)
    );
  }

  private _onFormChanges(values) {
    if (values.placementPolicy !== null) {
      this.show = true;
    } else {
      this.show = false;
    }
    if (values.placementPolicy === "Prioritise") {
      this.prioritise = true;
    } else {
      this.prioritise = false;
    }
  }

  save(placementPolicyForm: FormGroup) {
    if (
      this.datacentersSelected.length < 1 &&
      placementPolicyForm.controls.placementPolicy.value === "Prioritise"
    ) {
      let title = "oh oh...";
      let content =
        "Please, select at least one datacenter for this placement policy.";
      let action = "Accept";
      this.dialogData.openDialog(title, content, action, () => {});
    } else {
      // Save request to catalog
      console.log("this  is save");
    }
  }

  cancel(placementPolicyForm: FormGroup) {
    placementPolicyForm.reset();
    this.datacentersSelected = new Array();
  }

  addMore(placementPolicyForm: FormGroup) {
    if (placementPolicyForm.controls.datacenter.value !== null) {
      this.error = false;
      this.datacentersSelected.push(
        placementPolicyForm.controls.datacenter.value
      );
      placementPolicyForm.get("datacenter").reset();
    } else {
      this.error = true;
    }
  }

  eraseEntry(item) {
    this.datacentersSelected = this.datacentersSelected.filter(x => x !== item);
  }
}
