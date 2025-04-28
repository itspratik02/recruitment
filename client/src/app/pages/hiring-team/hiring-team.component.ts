import { Component, OnInit } from '@angular/core';
import { JobPostService } from '../../services/job-post.service';
import { CommonModule, NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';

interface JobPost {
  jdid?: number;
  title: string;
  description: string;
  location: string;
  requirements: string;
  responsibilities: string;
  experienceRequired: number;
  applicationDeadline: string;
  hiringTeam: {
    hiringTeamId: number;
  };
}

@Component({
  selector: 'app-hiring-team',
  standalone: true,
  templateUrl: './hiring-team.component.html',
  styleUrls: ['./hiring-team.component.css'],
  imports: [CommonModule, NgFor, NgIf, DatePipe, FormsModule, NavbarComponent]
})
export class HiringTeamComponent implements OnInit {
  jobPosts: any[] = [];
  jobPostsNew: any[] = [];
  filteredJobPosts: any[] = [];
  filterOption: string = 'all';
  hiringTeamId: number = 1; // Replace with actual logged-in hiring team ID
  activeJobPosts: any[] = [];
  totalApplications: number = 0;
  showCreateForm: boolean = false;
  userEmail: string = localStorage.getItem("email") || '';
  selectedFile: File | null = null;
  jobPostId: number = 0; 
  sheetForm : String = 'false'; // Flag to control the visibility of the sheet form
  duration: number = 0;
  totalMarks: number = 0;
  passingMarks: number = 0;
  noOfQuestions: number = 0;
  instructions: string = '';

  newJobPost: JobPost = {
    title: '',
    description: '',
    location: '',
    requirements: '',
    responsibilities: '',
    experienceRequired: 0,
    applicationDeadline: '',
    hiringTeam: {
      hiringTeamId: 1 // This should be set to the logged-in hiring team's ID
    }
  };

  constructor(
    private jobPostService: JobPostService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadJobPosts();
    this.jobPostService.getAllJobPostsWithCnt().subscribe({
      next: (data) => {
        this.jobPostsNew = data;
        console.log('Job posts with applied count:', this.jobPosts);
      },
      error: (error) => {
        console.error('Error loading job posts:', error);
      }
    });
  }

  loadJobPosts(): void {
    this.jobPostService.getAllJobPosts().subscribe({
      next: (data) => {
        this.jobPosts = data;
        this.processJobPosts();
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading job posts:', error);
      }
    });
  }


  addSheet(jdid : number){
      this.jobPostId = jdid;
      this.sheetForm = 'true'; // Show the sheet form
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Selected file:', file);
    }
  }

  closePopup() {
    this.sheetForm = 'false'; // Hide the sheet form
  }

  onSubmit() {
    if (!this.selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
  formData.append('file', this.selectedFile);
  formData.append('duration', this.duration.toString());
  formData.append('totalMarks', this.totalMarks.toString());
  formData.append('passingMarks', this.passingMarks.toString());
  formData.append('noOfQuestions', this.noOfQuestions.toString());
  formData.append('instructions', this.instructions);

    const uploadUrl = `http://localhost:8080/api/assessment/upload/${this.jobPostId}`; 
    // Change port if needed

    this.http.post(uploadUrl, formData).subscribe({
      next: (response:any) => {
        console.log('Upload successful:', response);
        alert('Assessment uploaded successfully!');
      },
      error: (error:any) => {
        console.error('Upload failed:', error);
        alert('Failed to upload assessment.');
      }
    });
  }
  

  processJobPosts(): void {
    const now = new Date();
    this.activeJobPosts = this.jobPosts.filter(job => 
      new Date(job.applicationDeadline) >= now
    );
    this.totalApplications = this.jobPosts.reduce((sum, job) => 
      sum + (job.appliedCount || 0), 0
    );
  }

  applyFilter(): void {
    const now = new Date();
    switch (this.filterOption) {
      case 'my':
        this.filteredJobPosts = this.jobPosts.filter(
          job => job.hiringTeam.hiringTeamId === this.hiringTeamId
        );
        break;
      case 'active':
        this.filteredJobPosts = this.jobPosts.filter(
          job => new Date(job.applicationDeadline) >= now
        );
        break;
      case 'expired':
        this.filteredJobPosts = this.jobPosts.filter(
          job => new Date(job.applicationDeadline) < now
        );
        break;
      default:
        this.filteredJobPosts = this.jobPosts;
    }
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  createJobPost(): void {
    this.jobPostService.createJobPost(this.newJobPost,this.userEmail).subscribe({
      next: (response) => {
        this.loadJobPosts();
        this.showCreateForm = false;
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating job post:', error);
      }
    });
  }

  resetForm(): void {
    this.newJobPost = {
      title: '',
      description: '',
      location: '',
      requirements: '',
      responsibilities: '',
      experienceRequired: 0,
      applicationDeadline: '',
      hiringTeam: {
        hiringTeamId: this.hiringTeamId
      }
    };
  }

  deleteJob(jobId: number): void {
    if (confirm('Are you sure you want to delete this job post?')) {
      this.jobPostService.deleteJobPost(jobId).subscribe({
        next: () => {
          this.loadJobPosts();
        },
        error: (error) => {
          console.error('Error deleting job post:', error);
        }
      });
    }
  }

  getStatusBadgeClass(job: any): string {
    const now = new Date();
    const deadline = new Date(job.applicationDeadline);
    if (deadline < now) {
      return 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
    }
    return 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
  }

  getStatusText(job: any): string {
    const now = new Date();
    const deadline = new Date(job.applicationDeadline);
    return deadline < now ? 'Expired' : 'Active';
  }
}