import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-sla-templates-detail",
  templateUrl: "./sla-templates-detail.component.html",
  styleUrls: ["./sla-templates-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlaTemplatesDetailComponent implements OnInit {
  loading: boolean;
  date: string;
  templateForm: FormGroup;
  listNS = new Array();
  guaranties = new Array();
  closed: boolean = true;

  name: string;
  author: string;
  createdAt: string;
  ns: string;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.name = "name";
    this.author = "author";
    this.createdAt = "date";
    this.listNS = ["A", "B"];

    this.route.params.subscribe(params => {
      let uuid = params["id"];

      // TODO request details of the SLA

      // TODO request NS
      this.templateForm = new FormGroup({
        ns: new FormControl(),
        guarantee: new FormControl()
      });
      this.templateForm.controls.ns.setValue("A");
      this.templateForm.valueChanges.subscribe(value =>
        this._onFormChanges(value)
      );

      // TODO request guaranties
      this.guaranties = ["g1", "g2"];
    });
  }

  private _onFormChanges(values) {}

  searchNS(templateForm) {
    console.log("this is search");
  }

  receiveDate($event) {
    this.date = $event;
  }

  close() {
    this.router.navigate(["service-platform/slas/sla-templates"]);
  }
}
