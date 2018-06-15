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
  storedGuarantees = new Array();
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
    this.storedGuarantees = [
      { name: "nameg", property: "prop", value: "value", period: "period" },
      { name: "nameg2", property: "prop2", value: "value2", period: "period2" }
    ];

    this.templateForm = new FormGroup({
      ns: new FormControl(),
      guarantee: new FormControl()
    });

    this.templateForm.valueChanges.subscribe(value =>
      this._onFormChanges(value)
    );

    this.route.params.subscribe(params => {
      let uuid = params["id"];
      this.requestSLATemplate(uuid);
    });
  }

  requestSLATemplate(uuid) {
    // TODO request SLA template detail

    // TODO request NS

    // TODO request details of the SLA:
    // including selected NS to set in form
    // including stored guarantees to set in form
    this.templateForm.controls.ns.setValue("A");

    // TODO request available guaranties
    this.guaranties = ["g1", "g2"];
  }

  private _onFormChanges(values) {
    // TODO NS search of ns changes
  }

  receiveNS($event) {
    this.templateForm.controls.ns.setValue($event);
    // TODO guarantees search according NS
  }

  receiveGuarantee($event) {
    this.templateForm.controls.guarantee.setValue($event);
  }

  receiveDate($event) {
    this.date = $event;
  }

  close() {
    this.router.navigate(["service-platform/slas/sla-templates"]);
  }
}
