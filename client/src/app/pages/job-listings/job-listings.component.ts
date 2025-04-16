import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AboutComponent } from '../about/about.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-listings',
  standalone: true,
  templateUrl: './job-listings.component.html',
  styleUrls: ['./job-listings.component.css'],
  imports: [CommonModule, NgIf, NgFor, FormsModule,NavbarComponent,RouterLink] 
})
export class JobListingsComponent implements OnInit {
  searchQuery = '';
  isLoggedIn = false;
  jobs = [
    { 
      id: 1,
      title: "Frontend Developer", 
      company: "Sibility", 
      location: "Remote", 
      description: "Looking for an Angular developer." 
    },
    { 
      id: 2,
      title: "Backend Engineer", 
      company: "Centelon IT solutions", 
      location: "Bangalore, India", 
      description: "Expertise in Spring Boot required." 
    },
    { 
      id: 3,
      title: "UI/UX Designer", 
      company: "Centelon", 
      location: "New York, USA", 
      description: "Seeking a Figma expert." 
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      this.isLoggedIn = isAuthenticated;
    });
  }

  get filteredJobs() {
    return this.jobs.filter(job => 
      job.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  applyForJob(job: any) {
    if (!this.isLoggedIn) {
      this.redirectToLogin();
      return;
    }
    // Handle job application logic
    console.log(`Applying for job: ${job.title}`);
  }

  redirectToLogin() {
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: this.router.url } 
    });
  }
}
