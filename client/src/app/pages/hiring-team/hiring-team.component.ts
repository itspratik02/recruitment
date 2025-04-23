import { Component, OnInit } from '@angular/core';
import { JobPostService } from '../../services/job-post.service';
import { CommonModule, NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

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
  filteredJobPosts: any[] = [];
  filterOption: string = 'all';
  hiringTeamId: number = 1; // Replace with actual logged-in hiring team ID
  activeJobPosts: any[] = [];
  totalApplications: number = 0;
  showCreateForm: boolean = false;

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobPosts();
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
    this.jobPostService.createJobPost(this.newJobPost).subscribe({
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