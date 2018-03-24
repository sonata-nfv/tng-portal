import { Directive, ElementRef, Input } from "@angular/core";
import { environment } from "../../../environments/environment";

@Directive({
  selector: "[ifFeatureAvailable]"
})
export class FeatureAvailableDirective {
  @Input("ifFeatureAvailable") service: string;
  _element: ElementRef;
  constructor(el: ElementRef) {
    this._element = el;
  }

  ngOnInit() {
    const isServiceAvailable =
      environment.features_available.indexOf(this.service.toUpperCase()) > -1
        ? true
        : false;
    if (!isServiceAvailable) {
      this._element.nativeElement.style.display = "none";
    }
  }
}
