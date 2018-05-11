import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-functions",
  templateUrl: "./functions.component.html",
  styleUrls: ["./functions.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FunctionsComponent implements OnInit {
  searchText: string;

  constructor() {}

  ngOnInit() {}

  receiveMessage($event) {
    this.searchText = $event;
  }

  requestServices() {}
}
