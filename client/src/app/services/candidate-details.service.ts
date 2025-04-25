import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateDetailsService {
  private baseUrl = 'http://localhost:8080/api/candidate-profile';

  constructor(private http: HttpClient) { }
   
  getCandidate(candidateId : number) : Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${candidateId}/getCandidate`);
  }
  // Qualifications (Education)
  getQualifications(candidateId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${candidateId}/qualifications`);
  }

  saveQualifications(candidateId: number, qualifications: any[]): Observable<void> {
    console.log('Saving qualifications:', qualifications);
    return this.http.post<void>(`${this.baseUrl}/${candidateId}/qualifications`, qualifications);
  }

  // Experiences
  getExperiences(candidateId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${candidateId}/experiences`);
  }

  saveExperiences(candidateId: number, experiences: any[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${candidateId}/experiences`, experiences);
  }

  // Certificates
  getCertificates(candidateId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${candidateId}/certificates`);
  }

  saveCertificates(candidateId: number, certificates: any[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${candidateId}/certificates`, certificates);
  }
}
