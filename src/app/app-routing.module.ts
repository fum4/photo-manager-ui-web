import { NgModule } from '@angular/core';
import { type Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './routes/auth/auth.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '/auth' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
