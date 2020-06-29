import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

import { DashboardComponent } from './dashboard.component';

import { DashboardService } from './dashboard.service';

@NgModule({
	declarations: [
		DashboardComponent
	],
	imports: [
		CommonModule,
		AppRoutingModule,
	],
	providers: [ DashboardService ]
})
export class DashboardModule { }
