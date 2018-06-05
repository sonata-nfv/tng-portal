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
  _disabled: boolean = false;
  _required: boolean = true;
  select = new FormControl({
    disabled: this._disabled,
    required: this._required
  });

  @Input()
  set reset(reset: boolean) {
    if (reset) {
      this.select.reset();
    }
  }
  @Input()
  set disabled(disabled: boolean) {
    this._disabled = disabled;
    if (disabled) {
      this.select.disable();
    } else {
      this.select.enable();
    }
  }
  @Input()
  set required(required: boolean) {
    this._required = required;
  }
  @Input()
  set value(item: string) {
    this.select.setValue(item);
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
