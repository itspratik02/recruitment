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
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Add any initialization logic here
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        const response = await this.authService.login(
          this.loginForm.value.email,
          this.loginForm.value.password
        ).toPromise();

        console.log('Login response:', response); // Debugging log

        if (response && typeof response === 'object' && response.message.includes('Login successful')) {
          alert('Login successful! Redirecting...');

          // Check if the user is an admin
          if (response.message.includes('ADMIN')) {
            console.log('Redirecting to /dashboard'); // Debugging log
            this.router.navigateByUrl('/dashboard'); // Redirect to admin dashboard
          } else {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            console.log('Redirecting to', returnUrl); // Debugging log
            this.router.navigateByUrl(returnUrl); // Redirect to the return URL or home page
          }
        } else {
          alert(response?.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        alert('An error occurred during login. Please try again later.');
        console.error('Login error:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
