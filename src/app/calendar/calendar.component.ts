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
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  date = new FormControl();
  hidePlaceholder: boolean = true;
  placeholderMsg: string;

  /**
   * [Optional] Fixes the initial value whenever set
   */
  @Input()
  set value(item: string) {
    this.date.setValue(item);
  }
  /**
   * [Optional] Defines the placeholder for the datepicker.
   *            In case none is defined it will be hidden.
   */
  @Input()
  set placeholder(placeholder: string) {
    this.placeholderMsg = placeholder;
    this.hidePlaceholder = false;
  }
  /**
   * [Optional] Disables the calendar whenever active
   */
  @Input()
  set disabled(disabled: boolean) {
    if (disabled) {
      this.date.disable();
    } else {
      this.date.enable();
    }
  }
  /**
   * Provides the selected element.
   */
  @Output() dateEvent = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {
    this.date.valueChanges.subscribe(value => this._onFormChanges(value));
  }

  private _onFormChanges(values) {
    let date = values
      .toISOString()
      .replace(/T.*/, "")
      .split("-")
      .reverse()
      .join("/")
      .split("/");
    date[0] = (parseInt(date[0]) + 1).toString();
    const strDate = date.join("/");

    this.dateEvent.emit(strDate);
  }
}
