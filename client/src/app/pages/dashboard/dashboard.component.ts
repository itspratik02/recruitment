import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, HttpClientModule]
})
export class DashboardComponent implements OnInit {
  pendingUsers: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    console.log('DashboardComponent initialized'); // Debugging log
    this.fetchPendingUsers();
  }

  fetchPendingUsers(): void {
    this.http.get<any[]>('/api/users/pending-users').subscribe(
      (users) => {
        console.log('Pending users fetched:', users); // Debugging log
        this.pendingUsers = users;
      },
      (error) => {
        console.error('Error fetching pending users:', error);
      }
    );
  }

  updateStatus(userId: number, status: string): void {
    this.http.put(`/api/users/update-status/${userId}`, null, { params: { status } }).subscribe(
      () => {
        alert(`User ${status.toLowerCase()} successfully!`);
        this.fetchPendingUsers();
      },
      (error) => {
        console.error(`Error updating user status to ${status}:`, error);
      }
    );
  }
}
