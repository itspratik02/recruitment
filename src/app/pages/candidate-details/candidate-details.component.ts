import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css'],
  imports: [NgFor, ReactiveFormsModule]
})
export class CandidateDetailsComponent implements OnInit {
  candidateForm: FormGroup;
  isLoading = false;

  qualifications = ['HSC', 'SSC', 'Diploma', 'B.Tech', 'BCA', 'MCA', 'B.Sc', 'BCS', 'M.Tech', 'MBA'];
  passoutYears = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i); // Last 50 years

  constructor(private fb: FormBuilder) {
    this.candidateForm = this.fb.group({
      education: this.fb.array([
        this.fb.group({
          qualification: ['', Validators.required],
          specialization: ['', Validators.required],
          college: ['', Validators.required],
          passoutYear: ['', Validators.required],
          percentage: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
          board: ['', Validators.required]
        })
      ]),
      experience: this.fb.array([]), // Add dynamically
      certifications: this.fb.array([]), // Add dynamically
      resume: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  get educationControls() {
    return this.candidateForm.get('education') as FormArray;
  }

  get experienceControls() {
    return this.candidateForm.get('experience') as FormArray;
  }

  get certificationControls() {
    return this.candidateForm.get('certifications') as FormArray;
  }

  addEducation() {
    this.educationControls.push(
      this.fb.group({
        qualification: ['', Validators.required],
        specialization: ['', Validators.required],
        college: ['', Validators.required],
        passoutYear: ['', Validators.required],
        percentage: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        board: ['', Validators.required]
      })
    );
  }

  addExperience() {
    this.experienceControls.push(
      this.fb.group({
        company: ['', Validators.required],
        role: ['', Validators.required],
        duration: ['', Validators.required]
      })
    );
  }

  addCertification() {
    this.certificationControls.push(
      this.fb.group({
        name: ['', Validators.required],
        issuingOrganization: ['', Validators.required],
        year: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
      })
    );
  }

  onSubmit() {
    if (this.candidateForm.valid) {
      this.isLoading = true;
      console.log('Candidate Details:', this.candidateForm.value);

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        alert('Details submitted successfully!');
      }, 1500);
    } else {
      Object.keys(this.candidateForm.controls).forEach(key => {
        const control = this.candidateForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}