import { Component } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-job-listings',
  standalone: true,
  templateUrl: './job-listings.component.html',
  styleUrls: ['./job-listings.component.css'],
  imports: [CommonModule, NgIf, NgFor, FormsModule,NavbarComponent] 
})
export class JobListingsComponent {
  searchQuery = '';
  jobs = [
    { title: "Frontend Developer", company: "Sibility", location: "Remote", description: "Looking for an Angular developer." },
    { title: "Backend Engineer", company: "Centelon IT solutions", location: "Bangalore, India", description: "Expertise in Spring Boot required." },
    { title: "UI/UX Designer", company: "Centelon", location: "New York, USA", description: "Seeking a Figma expert." }
  ];

  get filteredJobs() {
    return this.jobs.filter(job => 
      job.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
