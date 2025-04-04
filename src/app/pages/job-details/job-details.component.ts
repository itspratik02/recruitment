import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  job: any;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const jobId = Number(this.route.snapshot.params['id']);
    // Temporary mock data - later this should come from a service
    this.job = {
      id: jobId,
      title: "Frontend Developer",
      company: "Sibility",
      location: "Remote",
      description: "Looking for an Angular developer.",
      requirements: [
        "3+ years of experience with Angular",
        "Strong TypeScript skills",
        "Experience with RxJS",
        "Understanding of REST APIs"
      ],
      responsibilities: [
        "Develop new features",
        "Maintain existing codebase",
        "Write unit tests",
        "Collaborate with team members"
      ]
    };

    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => this.isLoggedIn = isAuthenticated
    );
  }

  applyForJob() {
    // Add application logic here
    console.log('Applying for job:', this.job.title);
  }
}
