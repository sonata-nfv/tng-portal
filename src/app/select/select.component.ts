import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements OnInit {
  select = new FormControl({ disabled: false });

  @Input()
  set reset(reset: boolean) {
    if (reset) {
      this.select.reset();
    }
  }
  @Input()
  set disabled(disabled: boolean) {
    if (disabled) {
      this.select.disable();
    } else {
      this.select.enable();
    }
  }
  @Input() placeholder: string;
  @Input() list: Array<string>;
  @Output() selectEvent = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {
    this.select.valueChanges.subscribe(value => this._onFormChanges(value));
  }

  private _onFormChanges(values) {
    this.selectEvent.emit(values);
  }
}
