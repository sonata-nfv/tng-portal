import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { ServiceManagementService } from "../shared/services/serviceManagement/serviceManagement.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

import { Router } from "@angular/router";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequestsComponent implements OnInit {
  requests: Array<Object>;
  dataSource = new MatTableDataSource();
  displayedColumns = ['Request ID', 'Type', 'Created at', 'Updated at', 'Service ID', 'Status'];
  searchText: string;

  constructor(private serviceManagementService: ServiceManagementService, private router: Router, private dialogData: DialogDataService) { }

  ngOnInit() {
    this.serviceManagementService.getRequests().then((response) => {
      console.log(response);
      this.requests = response.map(function(item) {
        return {
          // TODO Create an object with the elements we want to display in table (like in available-network-services component)
          requestId: item.id,
          type: item.request_type,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          serviceId: item.service_uuid,
          status: item.status
        }
      });
      this.dataSource = new MatTableDataSource(this.requests);
    }).catch(err => {
      console.error(err);

      // Dialog informing the user to log in again when token expired
      if (err === 'Unauthorized') {
        let title = 'Your session has expired';
        let content = 'Please, LOG IN again because your access token has expired.';
        let action = 'Log in';

        this.dialogData.openDialog(title, content, action, () => {
          this.router.navigate(["/login"]);
        });
      }
    });
  }

  receiveMessage($event) {
    this.searchText = $event;
  }

}
