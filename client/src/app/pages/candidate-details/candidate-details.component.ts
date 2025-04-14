import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css'],
  imports: [NgFor, ReactiveFormsModule, NgIf]
})
export class CandidateDetailsComponent implements OnInit {
  candidateForm: FormGroup;
  currentStep = 'education'; // Tracks the current step (education, experience, certifications)
  degrees = ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'MBA', 'BCA', 'MCA', 'Diploma'];
  years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i); // Last 50 years

  constructor(private fb: FormBuilder) {
    this.candidateForm = this.fb.group({
      education: this.fb.array([]),
      experience: this.fb.array([]),
      certifications: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addEducation(); // Add an initial education entry
    this.addExperience(); // Add an initial experience entry
    this.addCertification(); // Add an initial certification entry
  }

  // Getters for FormArray controls
  get educationControls() {
    return this.candidateForm.get('education') as FormArray;
  }

  get experienceControls() {
    return this.candidateForm.get('experience') as FormArray;
  }

  get certificationControls() {
    return this.candidateForm.get('certifications') as FormArray;
  }

  // Add a new education entry
  addEducation() {
    this.educationControls.push(
      this.fb.group({
        collegeName: ['', Validators.required],
        university: ['', Validators.required],
        degree: ['', Validators.required],
        specialization: ['', Validators.required],
        startYear: ['', Validators.required],
        endYear: ['', Validators.required],
        percentage: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
      })
    );
  }

  // Remove an education entry
  removeEducation(index: number) {
    this.educationControls.removeAt(index);
  }

  // Add a new experience entry
  addExperience() {
    this.experienceControls.push(
      this.fb.group({
        companyName: ['', Validators.required],
        role: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        description: ['', Validators.required]
      })
    );
  }

  // Remove an experience entry
  removeExperience(index: number) {
    this.experienceControls.removeAt(index);
  }

  // Add a new certification entry
  addCertification() {
    this.certificationControls.push(
      this.fb.group({
        title: ['', Validators.required],
        issuedBy: ['', Validators.required],
        certificateURL: ['', Validators.required]
      })
    );
  }

  // Remove a certification entry
  removeCertification(index: number) {
    this.certificationControls.removeAt(index);
  }

  // Navigate to a specific step
  navigateToStep(step: string) {
    this.currentStep = step;
  }

  // Save and proceed to the next step
  saveAndProceed(nextStep: string) {
    this.currentStep = nextStep;
  }

  // Submit the form
  onSubmit() {
    if (this.candidateForm.valid) {
      console.log('Form Data:', this.candidateForm.value);
      alert('Details submitted successfully!');
    } else {
      alert('Please fill out all required fields.');
    }
  }
}