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
import {
	MatButtonModule,
	MatCardModule,
	MatIconModule,
	MatFormFieldModule,
	MatInputModule,
	MatCheckboxModule,
	MatDividerModule, MatListModule, MatTreeModule, MatExpansionModule
} from '@angular/material';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

@NgModule({
	declarations: [
		MainPageComponent,
		DescriptorGeneratorComponent,
		DescriptorDisplayerComponent,
		ProjectDetailComponent
	],
	imports: [
		CommonModule,
		AngularMaterialModule,
		SdkRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		FormsModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		TextFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatDividerModule,
		MatListModule,
		MatTreeModule,
		MatExpansionModule
	],
	providers: [SdkService]
})
export class SdkModule { }
