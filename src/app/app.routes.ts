import { Routes } from '@angular/router';
import { JobListingsComponent } from './pages/job-listings/job-listings.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  { path: '', component: JobListingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'about', component: AboutComponent }
];