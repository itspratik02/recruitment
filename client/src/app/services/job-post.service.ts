import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {
  private apiUrl = '/api/jobposts';

  // Dummy hiring teams
  private dummyTeams = [
    { hiringTeamId: 1, name: 'Tech Hiring Team', email: 'tech@company.com' },
    { hiringTeamId: 2, name: 'Marketing Team', email: 'marketing@company.com' }
  ];

  // Dummy job posts
  private dummyPosts = [
    {
      jdid: 1,
      title: 'Senior Java Developer',
      hiringTeam: this.dummyTeams[0],
      location: 'Mumbai',
      experienceRequired: 5,
      description: 'Looking for experienced Java developers',
      responsibilities: 'Lead development team, Design system architecture',
      requirements: 'Java, Spring Boot, Microservices',
      postDate: new Date(2025, 3, 1),
      applicationDeadline: new Date(2025, 5, 1),
      appliedCount: 25,
      createdByName: 'Tech Hiring Team'
    },
    {
      jdid: 2,
      title: 'Frontend Developer',
      hiringTeam: this.dummyTeams[0],
      location: 'Pune',
      experienceRequired: 3,
      description: 'Angular developer needed',
      responsibilities: 'Develop user interfaces, Implement responsive design',
      requirements: 'Angular, TypeScript, HTML, CSS',
      postDate: new Date(2025, 3, 10),
      applicationDeadline: new Date(2025, 4, 25),
      appliedCount: 15,
      createdByName: 'Tech Hiring Team'
    },
    {
      jdid: 3,
      title: 'Marketing Manager',
      hiringTeam: this.dummyTeams[1],
      location: 'Delhi',
      experienceRequired: 4,
      description: 'Experienced marketing professional needed',
      responsibilities: 'Lead marketing campaigns, Develop marketing strategy',
      requirements: 'Marketing, Team Management, Strategy Development',
      postDate: new Date(2025, 3, 15),
      applicationDeadline: new Date(2025, 5, 15),
      appliedCount: 8,
      createdByName: 'Marketing Team'
    },
    {
      jdid: 4,
      title: 'DevOps Engineer',
      hiringTeam: this.dummyTeams[0],
      location: 'Bangalore',
      experienceRequired: 2,
      description: 'Looking for DevOps expertise',
      responsibilities: 'Maintain CI/CD pipelines, Cloud infrastructure management',
      requirements: 'AWS, Docker, Kubernetes, Jenkins',
      postDate: new Date(2025, 3, 5),
      applicationDeadline: new Date(2025, 4, 30),
      appliedCount: 12,
      createdByName: 'Tech Hiring Team'
    },
    {
      jdid: 5,
      title: 'Product Manager',
      hiringTeam: this.dummyTeams[1],
      location: 'Hyderabad',
      experienceRequired: 6,
      description: 'Senior Product Manager position',
      responsibilities: 'Product strategy, Roadmap planning, Team leadership',
      requirements: 'MBA, 6+ years experience, Technical background',
      postDate: new Date(2025, 3, 20),
      applicationDeadline: new Date(2025, 5, 20),
      appliedCount: 18,
      createdByName: 'Marketing Team'
    }
  ];

  constructor(private http: HttpClient) {}

  getAllJobPosts(): Observable<any[]> {
    // Return dummy data instead of making HTTP request
    return of(this.dummyPosts);
  }

  getJobPostsByTeam(teamId: number): Observable<any[]> {
    // Filter dummy data by team ID
    return of(this.dummyPosts.filter(post => post.hiringTeam.hiringTeamId === teamId));
  }

  createJobPost(jobPost: any): Observable<any> {
    // Simulate creating a new job post
    const newPost = {
      ...jobPost,
      jdid: this.dummyPosts.length + 1,
      postDate: new Date(),
      appliedCount: 0
    };
    this.dummyPosts.push(newPost);
    return of(newPost);
  }

  updateJobPost(jobPost: any): Observable<any> {
    // Simulate updating a job post
    const index = this.dummyPosts.findIndex(post => post.jdid === jobPost.jdid);
    if (index !== -1) {
      this.dummyPosts[index] = { ...this.dummyPosts[index], ...jobPost };
      return of(this.dummyPosts[index]);
    }
    return of(null);
  }

  deleteJobPost(jobId: number): Observable<void> {
    // Simulate deleting a job post
    const index = this.dummyPosts.findIndex(post => post.jdid === jobId);
    if (index !== -1) {
      this.dummyPosts.splice(index, 1);
    }
    return of(void 0);
  }
}