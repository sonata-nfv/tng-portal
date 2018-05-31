import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter
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

  @Output() dateEvent = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {
    this.date.valueChanges.subscribe(value => this._onFormChanges(value));
  }

  private _onFormChanges(values) {
    this.dateEvent.emit(values);
  }
}
