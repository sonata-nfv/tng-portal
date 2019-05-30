import { NgModule } from '@angular/core';

import {
	MatInputModule,
	MatFormFieldModule,
	MatSelectModule,
	MatSidenavModule,
	MatTableModule,
	MatSortModule,
	MatDialogModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatCheckboxModule,
	MatRadioModule,
	MatSnackBarModule,
	MatTooltipModule,
	MatSliderModule
} from '@angular/material';

const modules = [
	MatFormFieldModule,
	MatInputModule,
	MatSelectModule,
	MatSidenavModule,
	MatTableModule,
	MatSortModule,
	MatDialogModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatCheckboxModule,
	MatRadioModule,
	MatSnackBarModule,
	MatTooltipModule,
	MatSliderModule
];

@NgModule({
	imports: [ modules ],
	exports: [ modules ]
})
export class AngularMaterialModule { }
