// Copyright (c) 2015 SONATA-NFV, 2017 5GTANGO , QUOBIS SL.
// ALL RIGHTS RESERVED.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Neither the name of the SONATA-NFV, 5GTANGO, QUOBIS SL.
// nor the names of its contributors may be used to endorse or promote
// products derived from this software without specific prior written
// permission.
//
// This work has been performed in the framework of the SONATA project,
// funded by the European Commission under Grant number 671517 through
// the Horizon 2020 and 5G-PPP programmes. The authors would like to
// acknowledge the contributions of their colleagues of the SONATA
// partner consortium (www.sonata-nfv.eu).
//
// This work has been performed in the framework of the 5GTANGO project,
// funded by the European Commission under Grant number 761493 through
// the Horizon 2020 and 5G-PPP programmes. The authors would like to
// acknowledge the contributions of their colleagues of the 5GTANGO
// partner consortium (www.5gtango.eu).

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { AppRoutingModule } from './app-routing.module';

import { MenuComponent } from './menu/menu.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';

import { AuthenticationModule } from './authentication/authentication.module';
import { ValidationAndVerificationModule } from './validation-and-verification/validation-and-verification.module';
import { ServicePlatformModule } from './service-platform/service-platform.module';
import { ServiceManagementModule } from './service-management/service-management.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [ AppComponent, MenuComponent, IndexComponent, DashboardComponent, UsersComponent ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ValidationAndVerificationModule,
        ServiceManagementModule,
        ServicePlatformModule,
        SharedModule,
        AuthenticationModule
    ],
    providers: [ { provide: LOCALE_ID, useValue: 'en' } ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
