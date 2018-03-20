import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ServiceManagementService } from "../shared/services/serviceManagement/serviceManagement.service";

@Component({
  selector: 'app-available-network-services',
  templateUrl: './available-network-services.component.html',
  styleUrls: ['./available-network-services.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AvailableNetworkServicesComponent implements OnInit {
  items: Array<String>;
  constructor(private serviceManagementService: ServiceManagementService) { 

  }

  ngOnInit() {
    
    this.serviceManagementService.getNetworkServices().then((response) => {
      // Set items for search-bar component by name
      this.items = response.map(item => item.nsd.name);
      // Populate the list of available network services
      console.log(this.items);
    
    }).catch(err => {
        console.log(err.error.error.message);
    });;
  }
}
