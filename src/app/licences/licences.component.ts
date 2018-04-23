import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material";

import { Router, ActivatedRoute } from "@angular/router";

import { ServiceManagementService } from "../shared/services/service-management/serviceManagement.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";
import { DataTransferService } from "../shared/services/service-management/dataTransfer.service";

@Component({
  selector: "app-licences",
  templateUrl: "./licences.component.html",
  styleUrls: ["./licences.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class LicencesComponent implements OnInit {
  loading: boolean;
  licences = new Array();
  dataSource = new MatTableDataSource();
  displayedColumns = ["Status", "Licence ID", "Related Service", "Type", "buy"];
  searchText: string;

  constructor(
    private serviceManagementService: ServiceManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private dataTransfer: DataTransferService,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.requestLicences();
  }

  requestLicences() {
    this.loading = true;
    this.serviceManagementService
      .getLicences()
      .then(response => {
        this.loading = false;
        this.licences = response.map(function(item) {
          return {
            searchField: item.licence_uuid,
            licenceId: item.licence_uuid,
            relatedService: item.service_uuid,
            type: item.licence_type,
            description: item.description,
            status: item.status
          };
        });
        this.licences = [
          {
            searchField: "uno",
            status: "active",
            licenceId: "11fff5fa-5770-4fe7-9e34-a0f60ae63b88",
            relatedService: "9f9213c9-1134-43bd-9351-50bff41765de",
            type: "public",
            description:
              "Description of service 1: fsdfhgsiduafgs aiud fgisuadf guisigaisd safsufhsu fuisfhhgf sdgfgiugii uigiagfg sdigf"
          },
          {
            searchField: "dos",
            status: "GHLJHG",
            licenceId: "21fff5fa-5770-4fe7-9e34-a0f60ae63b88",
            relatedService: "2f9213c9-1134-43bd-9351-50bff41765de",
            type: "public",
            description: "Description of service 2"
          }
        ];
        for (let i = 0; i < 5; i++) {
          this.licences = this.licences.concat(this.licences);
        }
      })
      .catch(err => {
        this.loading = false;
        console.error(err);

        // Dialog informing the user to log in again when token expired
        if (err === "Unauthorized") {
          let title = "Your session has expired";
          let content =
            "Please, LOG IN again because your access token has expired.";
          let action = "Log in";

          this.dialogData.openDialog(title, content, action, () => {
            this.router.navigate(["/login"]);
          });
        }
      });
  }

  receiveMessage($event) {
    this.searchText = $event;
  }
  openLicences(row) {
    let uuid = row.licenceId;
    let detail = this.licences.find(x => x.licenceId === uuid);
    this.dataTransfer.sendDetail(detail);
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }

  buy(row) {}
}
