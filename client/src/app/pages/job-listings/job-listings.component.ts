import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AboutComponent } from '../about/about.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobPostService } from '../../services/job-post.service';

@Component({
  selector: 'app-job-listings',
  standalone: true,
  templateUrl: './job-listings.component.html',
  styleUrls: ['./job-listings.component.css'],
  imports: [CommonModule, NgIf, NgFor, FormsModule,NavbarComponent,RouterLink] 
})
export class JobListingsComponent implements OnInit {
  searchQuery = '';
  isLoggedIn = false;
  jobs: any[] = [];
    
  constructor(
    private router: Router,
    private authService: AuthService,
    private jobPostService: JobPostService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe({
      next: (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
      },
      error: (error: any) => {
        console.error('Error checking authentication status:', error);
      }
    });

    this.jobPostService.getAllJobPosts().subscribe({
      next: (data: any[]) => {
        this.jobs = data;
        console.log('Job posts fetched successfully:', this.jobs);
      },
      error: (error: any) => {
        console.error('Error fetching job posts:', error);
      }
    });
  }

  get filteredJobs() {
    return this.jobs.filter(job => 
      job.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  applyForJob(job: any) {
    if (!this.isLoggedIn) {
      this.redirectToLogin();
      return;
    }
    // Handle job application logic
    console.log(`Applying for job: ${job.title}`);
  }

  redirectToLogin() {
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: this.router.url } 
    });
  }
}
