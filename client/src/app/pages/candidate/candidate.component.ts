import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { JobPostService } from '../../services/job-post.service';

@Component({
  selector: 'app-candidate',
  standalone: true,
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css'],
  imports: [NgFor]
})
export class CandidateComponent implements OnInit {
  jobs: any[] = [];

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private http: HttpClient,
    private jobPostService: JobPostService
  ) {}

  ngOnInit(): void {
    // Ensure the user is logged in
    // this.authService.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
    //   if (!isAuthenticated) {
    //     this.router.navigate(['/login']);
    //   }
    // });
    
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
   
  applyForJob(job: any): void {
    console.log(`Applying for job: ${job.title}`);
    alert(`You have successfully applied for the job: ${job.title}`);
  }

  viewJobDetails(jobId: number): void {
    this.router.navigate(['/job', jobId]);
  }
}
