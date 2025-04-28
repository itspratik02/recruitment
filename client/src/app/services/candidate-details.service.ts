import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateDetailsService {
 
  progress:number = 0;
  private baseUrl = 'http://localhost:8080/api/candidate-profile';

  constructor(private http: HttpClient) { }
  
  setProgress(value: number) {
    this.progress = value;
  }

  getProgress(): number {
    return this.progress;
  }

  getCandidate(candidateId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${candidateId}/getCandidate`);
  }
  
  saveQualifications(candidateId: number, qualifications: any[]): Observable<void> {
    console.log(qualifications);
    return this.http.post<void>(`${this.baseUrl}/${candidateId}/qualifications`, qualifications);
  }

  saveExperiences(candidateId: number, experiences: any[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${candidateId}/experiences`, experiences);
  }

  saveCertificates(candidateId: number, certificates: any[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${candidateId}/certificates`, certificates);
  }

  getMyApplications(candidateId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${candidateId}/applications`);
  }

  deleteQualification(qualificationId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/qualifications/${qualificationId}`);
  }

  deleteExperience(experienceId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/experiences/${experienceId}`);
  }

  deleteCertificate(certificateId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/certificates/${certificateId}`);
  }
}
