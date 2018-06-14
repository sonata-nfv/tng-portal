import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-sla-agreements-detail",
  templateUrl: "./sla-agreements-detail.component.html",
  styleUrls: ["./sla-agreements-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlaAgreementsDetailComponent implements OnInit {
  loading: boolean;
  agreementForm: FormGroup;

  name: string;
  author: string;
  date: string;
  ns: string;
  customer: string;
  propertyList: Array<Object>;
  availability: string;
  cost: string;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.name = "name";
    this.author = "author";
    this.date = "date";
    this.ns = "ns1";
    this.customer = "customer1";
    this.propertyList = [
      { property: "property1", guarantee: "guarantee1" },
      { property: "property22222332", guarantee: "guarantee2222" }
    ];
    this.availability = "90%";
    this.cost = "100€/month";

    this.route.params.subscribe(params => {
      let uuid = params["id"];
    });
  }

  close() {
    this.router.navigate(["service-platform/slas/sla-agreements"]);
  }
}
