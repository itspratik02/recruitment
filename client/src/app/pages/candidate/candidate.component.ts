import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-candidate',
  standalone: true,
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {
  jobs: any[] = [];

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // Ensure the user is logged in
    this.authService.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        this.router.navigate(['/login']);
      }
    });

    // Fetch job posts from the backend
    this.http.get<any[]>('http://localhost:8080/api/jobs').subscribe({
      next: (data) => {
        this.jobs = data;
      },
      error: (err) => {
        console.error('Error fetching job posts:', err);
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
