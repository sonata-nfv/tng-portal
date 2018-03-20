import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { ServiceManagementService } from "../shared/services/serviceManagement/serviceManagement.service";

@Component({
  selector: 'app-available-network-services',
  templateUrl: './available-network-services.component.html',
  styleUrls: ['./available-network-services.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AvailableNetworkServicesComponent {
  networkServices: Array<Object>;
  dataSource = new MatTableDataSource();
  displayedColumns = ['Status', 'Service Name', 'Vendor', 'Version', 'Service ID', 'Type'];
  searchText: string;

  constructor(private serviceManagementService: ServiceManagementService) { 

  }

  ngOnInit() {
    this.serviceManagementService.getNetworkServices().then((response) => {
      // Populate the list of available network services
      this.networkServices = response.map(function(item) { 
        return {
          searchField: item.nsd.name,
          status: item.status,
          serviceName: item.nsd.name,
          vendor: item.nsd.vendor,
          version: item.nsd.version,
          serviceId: item.uuid,
          type: item.user_licence
        }
      });
      console.log(response)
      this.dataSource = new MatTableDataSource(this.networkServices);   
    }).catch(err => {
        console.log(err.error.error.message);
    });;
  }

  receiveMessage($event) {
    this.searchText = $event;
  }
}
