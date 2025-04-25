import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { JobPostService } from '../../services/job-post.service';

@Component({
  selector: 'app-candidate',
  standalone: true,
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css'],
  imports: [NgFor, NgIf, RouterLink]
})
export class CandidateComponent implements OnInit {
  jobs: any[] = [];
  candidateId: number = localStorage.getItem('id') ? Number(localStorage.getItem('id')) : 0;
  private baseUrl = 'http://localhost:8080/api';

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
      },
      error: (error: any) => {
        console.error('Error fetching job posts:', error);
      }
    });
  }
   
  async applyForJob(job: any): Promise<void> {
    try {
      // First check profile completion
      const profileCompletion = await this.checkProfileCompletion();
      
      if (profileCompletion < 100) {
        alert('Please complete your profile before applying. Current completion: ' + profileCompletion + '%');
        this.router.navigate(['/candidate-details']);
        return;
      }

      // Create file input and trigger click
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.doc,.docx';
      
      fileInput.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append('resume', file);
          formData.append('jobId', job.jdid);
          formData.append('candidateId', this.candidateId.toString());

          try {
            await this.http.post(`${this.baseUrl}/applications/apply`, formData).toPromise();
            alert('Successfully applied for the job: ' + job.title);
          } catch (error) {
            console.error('Error applying for job:', error);
            alert('Failed to apply for the job. Please try again.');
          }
        }
      };

      fileInput.click();
    } catch (error) {
      console.error('Error in applyForJob:', error);
      alert('An error occurred while applying for the job.');
    }
  }

  async checkProfileCompletion(): Promise<number> {
    try {
      const response = await this.http.get<any>(`${this.baseUrl}/candidate-profile/${this.candidateId}/completion`).toPromise();
      return response.completion;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return 0;
    }
  }

  viewJobDetails(jobId: number): void {
    this.router.navigate(['/job', jobId]);
  }
}

