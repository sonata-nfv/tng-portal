import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";

import { DialogComponent } from "../../components/dialog/dialog.component";

@Injectable()
export class DialogDataService {
  constructor(public dialog: MatDialog) {}

  openDialog(title: string, content: string, action: string, onAction: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: title,
        content: content,
        action: action.toUpperCase()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "action") {
        onAction();
      }
    });
  }
}
