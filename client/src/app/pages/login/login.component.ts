import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = true; // Initialize isLoading to true
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.isLoading = false; 
    // Add any initialization logic here
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log(response);
          const role = response.role; 
        
          if (role.match("not")) {
            alert("Waiting for admin approval");
            return;
          }
          if (role) {
            this.authService.saveToken(response.token);
            localStorage.setItem('userRole', role);
            localStorage.setItem('id', response.uid.toString());
            localStorage.setItem("email",email);
            console.log('User role:', role);
            if (role.match("ADMIN")) {
              this.router.navigateByUrl('/ADMIN-dashboard');
            }
            else
            this.router.navigateByUrl(`/${role}-dashboard`);
          } else {
            alert('Invalid role received from the server.');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('Login failed. Please check your credentials.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
