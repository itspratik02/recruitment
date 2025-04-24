import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

export class CandidateDetailsService {
    private baseUrl = 'http://localhost:8080/api/candidate-profile'; // Adjust the base URL as needed
    private candidateDetailsSubject = new BehaviorSubject<any[]>([]);
    candidateDetails$ = this.candidateDetailsSubject.asObservable();
    
    constructor(private http: HttpClient) {}
    
    getQualifications(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/getcandidates`).pipe(
        tap((details) => {
            this.candidateDetailsSubject.next(details);
        })
        );
    }
    }
