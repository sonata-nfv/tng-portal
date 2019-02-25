import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

import { VimComponent } from './vim/vim.component';
import { VimDetailComponent } from './vim-detail/vim-detail.component';
import { VimCreateComponent } from './vim-create/vim-create.component';
import { WimComponent } from './wim/wim.component';
import { WimDetailComponent } from './wim-detail/wim-detail.component';
import { WimCreateComponent } from './wim-create/wim-create.component';

import { SettingsService } from './settings.service';

@NgModule({
    declarations: [
        VimComponent,
        VimDetailComponent,
        VimCreateComponent,
        WimComponent,
        WimDetailComponent,
        WimCreateComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        AppRoutingModule,
        SharedModule,
        NgxJsonViewerModule,
        ReactiveFormsModule,
        FormsModule
    ],
    providers: [ SettingsService ]
})
export class SettingsModule { }
