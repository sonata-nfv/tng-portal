import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-network-service-instances",
  templateUrl: "./network-service-instances.component.html",
  styleUrls: ["./network-service-instances.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NetworkServiceInstancesComponent implements OnInit {
  searchText: string;

  constructor() {}

  ngOnInit() {}

  receiveMessage($event) {
    this.searchText = $event;
  }
}
