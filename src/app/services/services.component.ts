import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ServicesComponent implements OnInit {
  searchText: string;

  constructor() {}

  ngOnInit() {}

  receiveMessage($event) {
    this.searchText = $event;
  }
}
