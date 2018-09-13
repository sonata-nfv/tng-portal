import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-user-licences",
  templateUrl: "./user-licences.component.html",
  styleUrls: ["./user-licences.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class UserLicencesComponent implements OnInit {
  searchText: string;

  constructor() {}

  ngOnInit() {}

  receiveMessage($event) {
    this.searchText = $event;
  }
}
