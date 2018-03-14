import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatInputModule, MatFormFieldModule, MatSelectModule} from "@angular/material";

const modules = [BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatSelectModule];

@NgModule({
  imports: [modules],
  exports: [modules]
})
export class AngularMaterialModule {}
