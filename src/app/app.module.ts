import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from './shared/material/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportListComponent } from './pages/report-list/report-list.component';
import { ReportFormComponent } from './pages/report-form/report-form.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';
import { UserFormComponent } from './shared/user-form/user-form.component';
import { AiAnalyzerComponent } from './pages/ai-analyzer/ai-analyzer.component';
import { InfiniteScrollDirective } from './shared/directives/infinite-scroll.directive';
import { JwtInterceptor } from './core/auth/jwt.interceptor';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainLayoutComponent,
    DashboardComponent,
    ReportListComponent,
    ReportFormComponent,
    AnalyticsComponent,
    UserManagementComponent,
    UserFormComponent,
    AiAnalyzerComponent,
    InfiniteScrollDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    FontAwesomeModule,
    MaterialModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
