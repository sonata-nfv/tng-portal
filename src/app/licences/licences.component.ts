import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material";

import { Router, ActivatedRoute } from "@angular/router";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";


@Component({
  selector: "app-licences",
  templateUrl: "./licences.component.html",
  styleUrls: ["./licences.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LicencesComponent implements OnInit {
  loading: boolean;
  licenses: Array<Object>;
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "Status",
    "Licence ID",
    "Related Service",
    "Type",
  ];
  searchText: string;

  constructor(
  ) {}

  ngOnInit() {
    this.loading = false;
    this.licenses = [{
      searchField: 'uno',
      status: 'active',
      licenceId: '11fff5fa-5770-4fe7-9e34-a0f60ae63b88',
      relatedService: "9f9213c9-1134-43bd-9351-50bff41765de",
      type: 'public'
    },{
      searchField: 'dos',
      status: 'GHLJHG',
      licenceId: '21fff5fa-5770-4fe7-9e34-a0f60ae63b88',
      relatedService: "2f9213c9-1134-43bd-9351-50bff41765de",
      type: 'public'
    }];
    for (let i = 0; i < 5; i++) {
      this.licenses = this.licenses.concat(
        this.licenses
      );
    }

  }

  receiveMessage($event) {
    this.searchText = $event;
  }
}
