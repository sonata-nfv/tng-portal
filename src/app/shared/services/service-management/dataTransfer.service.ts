import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataTransferService {
  data = new BehaviorSubject<any>([]);
  cast = this.data.asObservable();

  sendDetail(detail) {
    this.data.next(detail);
  }
}
