import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ServiceManagementService } from "../shared/services/serviceManagement/serviceManagement.service";

import { Router } from "@angular/router";

@Component({
  selector: 'app-network-service',
  templateUrl: './network-service.component.html',
  styleUrls: ['./network-service.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NetworkServiceComponent implements OnInit {
  uuid: string;
  name: string;
  author: string;
  version: string;
  vendor: string;
  serviceID: string;
  type: string;
  description: string;

  constructor(private serviceManagementService: ServiceManagementService, private router: Router) { }

  ngOnInit() {
    // GET uuid from URL

    this.serviceManagementService.getNetworkService(this.uuid).then((response) => {
      // Take the params desired and pass them to HTML

      console.log(response);
    }).catch(err => {
      console.error(err);
    });
  }

  // TODO instance from network service displayed
  instanciate() {
    console.log("TODO instanciate");
  }

  close() {
    // TODO remove id from URL
    this.router.navigate(["/availableNetworkServices"]);
  }



}
