import { Routes } from '@angular/router';
import { JobListingsComponent } from './pages/job-listings/job-listings.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AboutComponent } from './pages/about/about.component';
import { JobDetailsComponent } from './pages/job-details/job-details.component';
import { CandidateDetailsComponent } from './pages/candidate-details/candidate-details.component';
import { HiringTeamComponent } from './pages/hiring-team/hiring-team.component';
import { CandidateComponent } from './pages/candidate/candidate.component';

export const routes: Routes = [
  { path: '', component: JobListingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'job/:id', component: JobDetailsComponent },
  { path: 'candidate-details', component: CandidateDetailsComponent },
  { path: 'ADMIN-dashboard', component: DashboardComponent },
  { path: 'HR-dashboard', component: DashboardComponent },
  { path: 'HIRING_TEAM-dashboard', component: HiringTeamComponent },
  { path: 'CANDIDATE-dashboard', component: CandidateComponent },
  { path: 'hiring-team', component: HiringTeamComponent }
];