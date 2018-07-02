import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";

import { CommonService } from "../shared/services/common/common.service";
import { ServicePlatformService } from "../shared/services/service-platform/service-platform.service";
import { DialogDataService } from "../shared/services/dialog/dialog.service";

@Component({
  selector: "app-sla-templates-create",
  templateUrl: "./sla-templates-create.component.html",
  styleUrls: ["./sla-templates-create.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlaTemplatesCreateComponent implements OnInit {
  loading: boolean;
  closed: boolean = false;
  reset: boolean = false;
  disabledButton: boolean = true;
  templateForm: FormGroup;
  nsList = new Array();
  storedGuarantees = new Array();
  guarantiesList = new Array();
  guaranties = new Array();
  nss = new Array();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private servicePlatformService: ServicePlatformService,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.templateForm = new FormGroup({
      name: new FormControl(),
      ns: new FormControl(),
      expirationDate: new FormControl()
    });

    this.templateForm.valueChanges.subscribe(value =>
      this._onFormChanges(value)
    );

    this.loading = true;
    Promise.all([
      this.commonService.getNetworkServices(),
      this.servicePlatformService.getServiceGuarantees()
    ])
      .then(responses => {
        this.loading = false;

        // Save guarantees and NS data to display
        this.nsList = responses[0].map(x => x.serviceName);
        this.guarantiesList = responses[1]
          .filter(x => x.guaranteeID === "g1" || x.guaranteeID === "g2")
          .map(x => x.guaranteeID + " - " + x.name);
        // Save complete data from guarantees and NS
        this.nss = responses[0];
        this.guaranties = responses[1];
      })
      .catch(err => (this.loading = false));
  }

  // TODO on form changes check there's ns, expiration date and some guarantees and then activate save
  private _onFormChanges(value?) {
    if (
      this.templateForm.controls.ns.value != null &&
      this.templateForm.controls.name.value != null &&
      this.templateForm.controls.expirationDate.value != null &&
      this.storedGuarantees.length > 0
    ) {
      this.disabledButton = false;
    } else {
      this.disabledButton = true;
    }
  }

  receiveNS(ns) {
    this.templateForm.controls.ns.setValue(ns);
  }

  receiveDate(expirationDate) {
    this.templateForm.controls.expirationDate.setValue(expirationDate);
  }

  createSlaTemplate() {
    this.loading = true;

    const guarantees = this.storedGuarantees.map(x => x.guaranteeID);
    const nsd_uuid = this.nss.find(
      x => x.serviceName === this.templateForm.controls.ns.value
    ).serviceId;
    const expireDate = this.templateForm.controls.expirationDate.value;

    const template = {
      templateName: this.templateForm.controls.name.value,
      nsd_uuid,
      expireDate,
      guaranteeId: guarantees
    };

    this.servicePlatformService
      .postOneSLATemplate(template)
      .then(response => {
        this.loading = false;
        this.close();
      })
      .catch(err => {
        this.loading = false;
        // TODO change close to toast displaying error.
        this.close();
      });
  }

  addGuarantee(guarantee) {
    if (guarantee != null) {
      const id = guarantee.split(" - ")[0];
      this.storedGuarantees.push(
        this.guaranties.find(x => x.guaranteeID === id)
      );
      this._onFormChanges();

      this.reset = true;
      setTimeout(() => {
        this.reset = false;
      }, 5);
    }
  }

  eraseEntry(item) {
    this.storedGuarantees = this.storedGuarantees.filter(
      x => x.guaranteeID !== item.guaranteeID
    );
  }

  close() {
    this.router.navigate(["service-platform/slas/sla-templates"]);
  }
}
