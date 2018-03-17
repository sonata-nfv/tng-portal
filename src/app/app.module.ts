import { APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AngularMaterialModule } from "./angular-material/angular-material.module";
import { AppRoutingModule } from "./app-routing.module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AuthService } from "./services/auth/auth.service";
import { ConfigService } from "./services/config/config.service";
import { RegisteredComponent } from "./registered/registered.component";
import { MenuComponent } from './menu/menu.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ValidationComponent } from './validation/validation.component';
import { ServicePlatformComponent } from './service-platform/service-platform.component';
import { ServiceManagementComponent } from './service-management/service-management.component';

import { FeatureAvailableDirective } from "./shared/directives/feature-available.directive";

export function initConfiguration(configService: ConfigService): Function {
  return () => configService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    RegisteredComponent,
    DashboardComponent,
    MenuComponent,
    IndexComponent,
    FeatureAvailableDirective,
    ServiceManagementComponent,
    UsersComponent,
    ValidationComponent,
    ServicePlatformComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfiguration,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
