import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {
  private baseUrl = 'http://localhost:8080/api/jobposts';

  constructor(private http: HttpClient) {}


  // addAssesment(): Observable<any> {
  //   this.http.post(uploadUrl, formData);
  // }

  getAllJobPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getposts`);
  }

  getAllJobPostsWithCnt(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getJobPosts`);
  }

  createJobPost(jobPost: any, email: String): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${email}/createjobposts`, jobPost);
  }

  deleteJobPost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPostsByHiringTeam(hiringTeamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/team/${hiringTeamId}`);
  }
}