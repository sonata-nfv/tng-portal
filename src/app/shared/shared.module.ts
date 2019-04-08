import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DialogDataService } from './services/dialog/dialog.service';
import { CommonService } from './services/common/common.service';
import { UtilsService } from './services/common/utils.service';
import { ConfigService } from './services/config/config.service';
import { AuthService } from '../authentication/auth.service';
import { ChartService } from './services/common/chart.service';

import { CalendarComponent } from './components/calendar/calendar.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SelectComponent } from './components/select/select.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FeatureAvailableDirective } from './directives/feature-available.directive';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { FunctionsComponent } from './components/functions/functions.component';
import { RequestsComponent } from './components/requests/requests.component';
import { RequestDetailComponent } from './components/request-detail/request-detail.component';
import { RouterModule } from '@angular/router';

import { Validator } from './utils/validator';
import { ControlsValidator } from './utils/controls-validator';

export function initConfiguration(configService: ConfigService): Function {
	return () => configService.init();
}

@NgModule({
	declarations: [
		CalendarComponent,
		DialogComponent,
		SearchBarComponent,
		SelectComponent,
		SpinnerComponent,
		FeatureAvailableDirective,
		FunctionsComponent,
		RequestsComponent,
		RequestDetailComponent
	],
	entryComponents: [DialogComponent],
	imports: [
		CommonModule,
		AngularMaterialModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule.forChild([])
	],
	exports: [
		CalendarComponent,
		DialogComponent,
		SearchBarComponent,
		SelectComponent,
		SpinnerComponent,
		FeatureAvailableDirective,
		FunctionsComponent,
		RequestsComponent,
		RequestDetailComponent
	],
	providers: [
		ConfigService,
		AuthService,
		CommonService,
		UtilsService,
		DialogDataService,
		ChartService,
		{
			provide: APP_INITIALIZER,
			useFactory: initConfiguration,
			deps: [ConfigService],
			multi: true
		},
		Validator,
		ControlsValidator
	]
})
export class SharedModule { }
