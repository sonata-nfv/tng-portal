import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatInputModule, MatFormFieldModule } from "@angular/material";

const modules = [BrowserAnimationsModule, MatFormFieldModule, MatInputModule];

@NgModule({
  imports: [modules],
  exports: [modules]
})
export class AngularMaterialModule {}
