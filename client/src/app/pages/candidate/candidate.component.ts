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
  currentStep: 'job-listings' | 'applications' = 'job-listings';
  applications: any[]=[]; // Variable to store candidate data
  appliedJobIds: number[] = [];   // will contain all jobPost ids already applied by candidate
  myApplications: any[] = [];     // store applications (for My Applications tab)
  availableJobs: any[] = [];
  appliedJobs: any[] = []; // Store the applied jobs for the "My Applications" tab
  showPopup: boolean = false; // Flag to control popup visibility
  jobForDetails: any; 

  constructor(  
    private router: Router, 
    private authService: AuthService, 
    private http: HttpClient,
    private jobPostService: JobPostService,
    private candidateDetailsService: CandidateDetailsService
  ) {}

 

  ngOnInit(): void { 

    this.jobPostService.getAllJobPosts().subscribe({
      next: (data: any[]) => {
        this.jobs = data;
        
      },
      error: (error: any) => {
        console.error('Error fetching job posts:', error);
      }
    });
   

     setTimeout(() => {
       
      this.candidateDetailsService.getMyApplications(this.candidateId).subscribe({
        next: (data) => {
          this.applications = data;   // You can store it in a variable
          console.log('Candidate data:', this.applications); // Log the candidate data
          this.appliedJobIds = this.applications.map(app => app.jobPost.jdid); 
          this.appliedJobs = this.applications.map(app => app.jobPost);
          console.log('Applied job IDs:', this.appliedJobIds); // Log the applied job IDs
          if(this.applications.length <= 0) {
            // alert("No applications found for this candidate.");
            this.availableJobs = this.jobs;
          } 
          else {
            this.availableJobs = this.jobs.filter(job => !this.appliedJobIds.includes(job.jdid));
            console.log(this.availableJobs); // Log the applied jobs
          }
        },
        error: (err) => {
          console.error('Error fetching candidate:', err);
        }
      });

     }, 1000); // Wait for 1 second before checking progress
  
    }
  changeStep(step: 'job-listings' | 'applications') {
    this.currentStep = step;
  }
  logOut(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
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
        this.jobs = this.jobs.filter(job => job.jdid !== this.selectedJobId);
        this.showResumeUploadPopup = false;
      },
      error: (error) => {
        console.error('Error applying for job:', error);  
        alert('Failed to apply for the job. Please try again.');
      }
    });
  }
 
  closeResumeUploadPopup(): void {
    this.showResumeUploadPopup = false; // Hide the popup
  }


  closePopup(): void {
    this.showPopup = false; // Hide the popup
  }
  openDetails(jdid : number): void {
    this.showPopup = true; // Show the popup
    alert("Inside open details"+jdid);
    console.log("Applided jobs"+this.appliedJobs);
    const jobForDetails = this.appliedJobs.find(job => job.jobPost && job.jobPost.jdid === jdid);
     console.log("Found "+jobForDetails);

  }


  giveAssessment(){

  }

  viewJobDetails(jobId: number): void {
    this.router.navigate(['/job', jobId]);
  }

}


