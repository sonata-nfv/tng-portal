import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";

import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-functions",
  templateUrl: "./functions.component.html",
  styleUrls: ["./functions.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FunctionsComponent implements OnInit {
  loading: boolean;
  functions: Array<Object>;
  dataSource = new MatTableDataSource();
  displayedColumns = ["Vendor", "Name", "Version", "Status"];

  constructor(
    private servicePlatformService: ServicePlatformService,
    private router: Router,
    private dialogData: DialogDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.requestFunctions();
  }

  searchFieldData(search) {
    this.requestFunctions(search);
  }

  /**
   * Generates the HTTP request to get the list of functions.
   *
   * @param search [Optional] Function attributes that must be
   *                          matched by the returned list of
   *                          functions.
   */
  requestFunctions(search?) {
    this.loading = true;
    this.servicePlatformService
      .getFunctions(search)
      .then(response => {
        this.loading = false;

        this.functions = response;
        this.dataSource = new MatTableDataSource(this.functions);
      })
      .catch(err => {
        this.loading = false;

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

  openFunction(row) {}
}
