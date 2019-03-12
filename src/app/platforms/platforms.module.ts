import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { PlatformListComponent } from './platform-list/platform-list.component';
import { PlatformComponent } from './platform/platform.component';

import { PlatformsService } from './platforms.service';

@NgModule({
	declarations: [
		PlatformListComponent,
		PlatformComponent
	],
	imports: [
		CommonModule,
		AngularMaterialModule,
		AppRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		FormsModule
	],
	providers: [ PlatformsService ]
})
export class PlatformsModule { }
