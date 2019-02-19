import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { VimComponent } from './vim/vim.component';
import { VimDetailComponent } from './vim-detail/vim-detail.component';
import { WimComponent } from './wim/wim.component';

import { SettingsService } from './settings.service';

@NgModule({
    declarations: [
        VimComponent,
        VimDetailComponent,
        WimComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        AppRoutingModule,
        SharedModule,
        NgxJsonViewerModule
    ],
    providers: [ SettingsService ]
})
export class SettingsModule { }
