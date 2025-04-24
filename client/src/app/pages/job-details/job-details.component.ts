import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { JobPostService } from '../../services/job-post.service';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  job: any;
  isLoggedIn:any = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private jobPostService: JobPostService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadJobDetails();
    this.isLoggedIn = this.authService.isAuthenticated$.subscribe({
      next: (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
      },
      error: (error: any) => {
        console.error('Error checking authentication status:', error);
      }
    }); 
  }

  loadJobDetails() {
    const jobId = +this.route.snapshot.paramMap.get('id')!; // this gets the job id from URL
  
    this.jobPostService.getAllJobPosts().subscribe({
      next: (data: any[]) => {
        console.log('Job posts fetched successfully:', data);
        this.job = data.find(j => j.jdid === jobId); // replace `id` with correct property if needed
        if (!this.job) {
          console.error('Job not found for id:', jobId);
        } else {
          console.log('Job loaded successfully:', this.job);
        }
      },
      error: (error: any) => {
        console.error('Error fetching job posts:', error);
      }
    });
  }
  

  applyForJob() {
    // Add application logic here
    console.log('Applying for job:', this.job.title);
  }
}
