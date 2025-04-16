import { Routes } from '@angular/router';
import { JobListingsComponent } from './pages/job-listings/job-listings.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AboutComponent } from './pages/about/about.component';
import { JobDetailsComponent } from './pages/job-details/job-details.component';
import { CandidateDetailsComponent } from './pages/candidate-details/candidate-details.component';

export const routes: Routes = [
  { path: '', component: JobListingsComponent },
  { path:'login', component: LoginComponent },
  { path: 'job/:id', component: JobDetailsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'candidate-details', component: CandidateDetailsComponent },
  { path: 'dashboard', component: DashboardComponent }
];