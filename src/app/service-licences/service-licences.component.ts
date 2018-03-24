import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-service-licences",
  templateUrl: "./service-licences.component.html",
  styleUrls: ["./service-licences.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ServiceLicencesComponent implements OnInit {
  searchText: string;

  constructor() {}

  ngOnInit() {}

  receiveMessage($event) {
    this.searchText = $event;
  }
}
