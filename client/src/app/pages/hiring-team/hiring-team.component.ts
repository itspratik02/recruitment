import { Component, OnInit } from '@angular/core';
import { JobPostService } from '../../services/job-post.service';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-hiring-team',
  standalone: true,
  templateUrl: './hiring-team.component.html',
  styleUrls: ['./hiring-team.component.css'],
  imports: [NgFor, NgIf, DatePipe, FormsModule,NavbarComponent]
})
export class HiringTeamComponent implements OnInit {
  jobPosts: any[] = [];
  filteredJobPosts: any[] = [];
  filterOption: string = 'all';
  hiringTeamId: number = 1; // Replace with actual logged-in hiring team ID
  activeJobPosts: any[] = [];
  totalApplications: number = 0;

  constructor(
    private jobPostService: JobPostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobPosts();
  }

  loadJobPosts(): void {
    this.jobPostService.getAllJobPosts().subscribe((data: any[]) => {
      this.jobPosts = data;
      this.processJobPosts();
      this.applyFilter();
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

  createJobPost(): void {
    this.router.navigate(['/create-job-post']);
  }

  editJob(job: any): void {
    this.router.navigate(['/edit-job-post', job.jdid]);
  }

  deleteJob(jobId: number): void {
    if (confirm('Are you sure you want to delete this job post?')) {
      this.jobPostService.deleteJobPost(jobId).subscribe(() => {
        this.loadJobPosts();
      });
    }
  }

  createAssessment(jobId: number): void {
    this.router.navigate(['/create-assessment', jobId]);
  }
}