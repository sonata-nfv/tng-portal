import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard.component';

import { DashboardService } from './dashboard.service';

@NgModule({
	declarations: [
		DashboardComponent
	],
	imports: [
		CommonModule,
		AppRoutingModule,
		SharedModule,
	],
	providers: [ DashboardService ]
})
export class DashboardModule { }
