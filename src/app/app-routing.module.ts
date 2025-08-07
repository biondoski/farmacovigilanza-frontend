import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportListComponent } from './pages/report-list/report-list.component';
import { ReportFormComponent } from './pages/report-form/report-form.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { AuthGuard } from './core/auth/auth.guard';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';
import { AiAnalyzerComponent } from './pages/ai-analyzer/ai-analyzer.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'segnala', component: ReportFormComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reports', component: ReportListComponent },
      { path: 'reports/new', component: ReportFormComponent },
      { path: 'reports/edit/:id', component: ReportFormComponent },
      {
        path: 'analytics',
        component: AnalyticsComponent,
        data: { role: 'Analista' }
      },
      {
        path: 'admin/users',
        component: UserManagementComponent,
        data: { role: 'Admin' }
      },
      {
        path: 'ai-analyzer',
        component: AiAnalyzerComponent,
        data: { role: 'Analista' }
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
