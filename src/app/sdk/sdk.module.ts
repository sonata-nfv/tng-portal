import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdkRoutingModule } from './sdk-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { SdkService } from './sdk.service';

import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
	declarations: [
		MainPageComponent
	],
	imports: [
		CommonModule,
		AngularMaterialModule,
		SdkRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		FormsModule
	],
	providers: [ SdkService ]
})
export class SdkModule { }
