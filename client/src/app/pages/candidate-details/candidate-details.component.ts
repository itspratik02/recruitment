import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, DatePipe],
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {
  candidateForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  error: string | null = null;
  currentStep = 'education';
  profileImage: string | null = null;
  candidateName = '';
  candidateTitle = '';
  
  degrees = ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'MBA', 'BCA', 'MCA', 'Diploma'];
  years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
  
  educationData: any[] = [];
  experienceData: any[] = [];
  certificationsData: any[] = [];

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

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      // Initialize form with current data
      this.initializeFormWithData();
    }
  }

  initializeFormWithData() {
    // Clear existing form arrays
    while (this.educationControls.length) {
      this.educationControls.removeAt(0);
    }
    while (this.experienceControls.length) {
      this.experienceControls.removeAt(0);
    }
    while (this.certificationControls.length) {
      this.certificationControls.removeAt(0);
    }

    // Add current data to form arrays
    this.educationData.forEach(edu => {
      this.educationControls.push(
        this.fb.group({
          collegeName: [edu.collegeName, Validators.required],
          university: [edu.university, Validators.required],
          degree: [edu.degree, Validators.required],
          specialization: [edu.specialization, Validators.required],
          startYear: [edu.startYear, Validators.required],
          endYear: [edu.endYear, Validators.required],
          percentage: [edu.percentage, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
        })
      );
    });

    this.experienceData.forEach(exp => {
      this.experienceControls.push(
        this.fb.group({
          companyName: [exp.companyName, Validators.required],
          role: [exp.role, Validators.required],
          startDate: [exp.startDate, Validators.required],
          endDate: [exp.endDate],
          description: [exp.description, Validators.required]
        })
      );
    });

    this.certificationsData.forEach(cert => {
      this.certificationControls.push(
        this.fb.group({
          title: [cert.title, Validators.required],
          issuedBy: [cert.issuedBy, Validators.required],
          certificateURL: [cert.certificateURL, Validators.required]
        })
      );
    });
  }

  async uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  }
}