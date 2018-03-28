import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { MAT_DIALOG_DATA } from "@angular/material";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-instantiate-dialog",
  templateUrl: "./instantiate-dialog.component.html",
  styleUrls: ["./instantiate-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class InstantiateDialogComponent implements OnInit {
  // TODO GET posible locations
  locations = ["Aveiro", "Barcelona"];

  constructor(
    public dialogRef: MatDialogRef<InstantiateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  instantiate(instantiation: NgForm) {
    console.log("instantiating-......");
    // Send request to instantiate with data
    // Close dialog
    // Show pop up saying success/error with id xxxxx
  }
}
