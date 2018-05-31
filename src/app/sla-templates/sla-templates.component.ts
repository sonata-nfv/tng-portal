import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { FormGroup, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-sla-templates",
  templateUrl: "./sla-templates.component.html",
  styleUrls: ["./sla-templates.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlaTemplatesComponent implements OnInit {
  loading: boolean;
  templates = new Array();
  dataSource = new MatTableDataSource();
  nsForm: FormGroup;
  displayedColumns = ["name", "ID", "ns", "expirationDate", "delete"];
  searchText: string;

  // TODO request NS
  listNS = ["A", "B"];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.nsForm = new FormGroup({
      ns: new FormControl()
    });
    this.nsForm.valueChanges.subscribe(value => this._onFormChanges(value));

    this.requestTemplates();

    this.templates = [
      {
        name: "sla1",
        uuid: "45217851155",
        ns: "ns1",
        expirationDate: "05/12/2019"
      }
    ];
  }

  private _onFormChanges(values) {
    // TODO request list from NS each time the user selects one
  }

  requestTemplates() {
    // this.loading = true;
    // TODO request the templates according to NS selected or all
  }

  receiveMessage($event) {
    this.searchText = $event;
  }

  remove(element) {
    // TODO send request to remove SLA from list
  }

  openTemplate(row) {
    let uuid = row.uuid;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
