import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatInputModule, MatFormFieldModule, MatSelectModule, MatSidenavModule, MatTableModule, MatSortModule, MatDialogModule} from "@angular/material";

const modules = [BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSidenavModule, MatTableModule, MatSortModule, MatDialogModule];

@NgModule({
  imports: [modules],
  exports: [modules]
})
export class AngularMaterialModule {}
