import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { provideHttpClient } from '@angular/common/http';
@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [NgClass, ReactiveFormsModule, NgIf, NavbarComponent],
  providers: [] // No need for provideHttpClient here
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Validate 10-digit phone number
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      userType: ['', Validators.required] // Ensure user selects a type
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {}

  /**
   * Checks if a form field is invalid and touched or dirty.
   * @param fieldName - The name of the form field.
   * @returns True if the field is invalid and touched/dirty, otherwise false.
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Custom validator to check if password and confirmPassword fields match.
   * @param group - The form group containing the password fields.
   * @returns Null if passwords match, otherwise an error object.
   */
  passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  /**
   * Toggles the visibility of the password field.
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggles the visibility of the confirm password field.
   */
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Checks if the password and confirm password fields match.
   * @returns True if passwords match, otherwise false.
   */
  isPasswordMatch(): boolean {
    return this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value;
  }

  /**
   * Handles form submission.
   * If the form is valid, simulates a registration process and logs the form data.
   */
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formData = this.registerForm.value;

      // Concatenate firstName and lastName into a single name field
      const user = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType
      };

      this.register(user);
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  /**
   * Registers a user using the AuthService.
   * @param user - The user data to register.
   */
  register(user: any): void {
    this.authService.registerUser(user).subscribe({
      next: (res: any) => {
        console.log('Registration successful:', res);
        this.isLoading = false;
        alert(res.message || 'Registration successful!');
      },
      error: (err: any) => {
        console.error('Registration error:', err);
        this.isLoading = false;
        alert(err.message || 'Something went wrong during registration!');
      }
    });
  }
}

