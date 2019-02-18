import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { VimSettingsComponent } from './vim-settings/vim-settings.component';
import { WimSettingsComponent } from './wim-settings/wim-settings.component';

import { SettingsService } from './settings.service';

@NgModule({
    declarations: [
        VimSettingsComponent,
        WimSettingsComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        AppRoutingModule,
        SharedModule
    ],
    providers: [ SettingsService ]
})
export class SettingsModule { }
