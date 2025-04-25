import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateDetailsService {
  private baseUrl = 'http://localhost:8080/api/candidate-profile';

  constructor(private http: HttpClient) { }
   
  getCandidate(candidateId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${candidateId}/getCandidate`);
  }
  
  saveQualifications(candidateId: number, qualifications: any[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${candidateId}/qualifications`, qualifications);
  }

  saveExperiences(candidateId: number, experiences: any[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${candidateId}/experiences`, experiences);
  }

  saveCertificates(candidateId: number, certificates: any[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${candidateId}/certificates`, certificates);
  }
}
