import { Component, OnInit,Input, OnChanges, SimpleChanges, } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { JobPostService } from '../../services/job-post.service';
import { CandidateDetailsService } from '../../services/candidate-details.service';
import { ResumeUploadPopupComponent } from '../../components/resume-upload-component/resume-upload-component.component';

@Component({
  selector: 'app-candidate',
  standalone: true,
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css'],
  imports: [NgFor, RouterLink,ResumeUploadPopupComponent, NgIf]
})
export class CandidateComponent implements OnInit {
  progress : number = 0;
  jobs: any[] = [];
  candidateId: number = localStorage.getItem('id') ? Number(localStorage.getItem('id')) : 0;
  private baseUrl = 'http://localhost:8080/api';
  showResumeUploadPopup: boolean = false; // Flag to control popup visibility
  selectedJobId: number  = 0; // Store the selected job ID

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private http: HttpClient,
    private jobPostService: JobPostService,
    private candidateDetailsService: CandidateDetailsService
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

      this.progress = this.candidateDetailsService.getProgress();
      // First check profile completio
      this.showResumeUploadPopup = true; // Show the popup
      
      if (this.progress < 100) {
        console.log('Profile not complete:', this.progress);
        alert('Please complete your profile before applying. Current completion: ' + this.progress + '%');
        // this.router.navigate(['/candidate-details']);
        return;
      }
      this.selectedJobId = job.jdid; 
      this.showResumeUploadPopup=true;// Store the selected job ID
    } catch (error) {
      console.error('Error in applyForJob:', error);
      alert('An error occurred while applying for the job.');
    }
  }
  
  onResumeUploaded(file: File): void {
    const formData = new FormData();
    formData.append('resume', file);
    alert("Inside apply for job"+this.selectedJobId ); 
    formData.append('jobId', this.selectedJobId.toString());
    formData.append('candidateId', this.candidateId.toString());
    
    this.http.post(`${this.baseUrl}/candidate-profile/applications/apply`, formData).subscribe({
      next: (data) => {
        alert('Successfully applied for the job.');
        this.showResumeUploadPopup = false;
      },
      error: (error) => {
        console.error('Error applying for job:', error);  
        alert('Failed to apply for the job. Please try again.');
      }
    });
  }


  viewJobDetails(jobId: number): void {
    this.router.navigate(['/job', jobId]);
  }

}


