import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { ServiceManagementService } from "../shared/services/serviceManagement/serviceManagement.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

import { Router } from "@angular/router";

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

  constructor(private serviceManagementService: ServiceManagementService, private router: Router, private dialogData: DialogDataService) {}

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
      this.dataSource = new MatTableDataSource(this.networkServices);   
    }).catch(err => {
        console.error(err);
        // Dialog informing the user to log in again when token expired
        let title = 'Your session has expired';
        let content = 'Please, log in again to access Service Management section.';
        let action = 'Log in';
        
        this.dialogData.openDialog(title, content, action, () => {
          this.router.navigate(["/login"]);
        });
    });;
  }

  private receiveMessage($event) {
    this.searchText = $event;
  }

}
