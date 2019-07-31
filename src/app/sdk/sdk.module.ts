import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SdkRoutingModule } from './sdk-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { SdkService } from './sdk.service';

import { MainPageComponent } from './main-page/main-page.component';
import { DescriptorGeneratorComponent } from './descriptor-generator/descriptor-generator.component';
import { DescriptorDisplayerComponent } from './descriptor-displayer/descriptor-displayer.component';
import { MatExpansionModule } from '@angular/material';

@NgModule({
	declarations: [
		MainPageComponent,
		DescriptorGeneratorComponent,
		DescriptorDisplayerComponent
	],
	imports: [
		CommonModule,
		AngularMaterialModule,
		SdkRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		FormsModule,
		MatExpansionModule
	],
	providers: [SdkService]
})
export class SdkModule { }
