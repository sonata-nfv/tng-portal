import { DataSource } from "@angular/cdk/table";
import { Observable, of } from "rxjs";

export class CustomDataSource extends DataSource<any> {
    data: Array<any>;

    // Connect function called by the table to retrieve one stream containing the data to render.
    connect(): Observable<any[]> {
        const rows = [];
        this.data.forEach(element => {
            rows.push(element, { detailRow: true, element });
        });
        return of(rows);
    }

    disconnect() { }
}
