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
	MatTooltipModule
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
	MatTooltipModule
];

@NgModule({
	imports: [ modules ],
	exports: [ modules ]
})
export class AngularMaterialModule { }
