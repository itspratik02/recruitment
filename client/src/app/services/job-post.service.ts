import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {
  private baseUrl = 'http://localhost:8080/api/jobposts';

  constructor(private http: HttpClient) {}

  getAllJobPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getposts`);
  }

  createJobPost(jobPost: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createjobposts`, jobPost);
  }

  deleteJobPost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPostsByHiringTeam(hiringTeamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/team/${hiringTeamId}`);
  }
}