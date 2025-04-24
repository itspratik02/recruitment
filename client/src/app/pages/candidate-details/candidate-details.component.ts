import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DatePipe } from '@angular/common';
import { CandidateDetailsService } from '../../services/candidate-details.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, DatePipe, HttpClientModule],
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
  candidateId: number = localStorage.getItem('id') ? Number(localStorage.getItem('id')) : 0;
  
  degrees = ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'MBA', 'BCA', 'MCA', 'Diploma'];
  years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
  
  educationData: any[] = [];
  experienceData: any[] = [];
  certificationsData: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    private candidateDetailsService: CandidateDetailsService,
    private route: ActivatedRoute
  ) {
    this.candidateForm = this.fb.group({
      education: this.fb.array([]),
      experience: this.fb.array([]),
      certifications: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;
    Promise.all([
      this.loadQualifications(),
      this.loadExperiences(),
      this.loadCertificates()
    ]).finally(() => {
      this.isLoading = false;
    });
  }
  
  async loadQualifications() {
    try {
      const qualifications = await this.candidateDetailsService.getQualifications(this.candidateId).toPromise();
      this.educationData = qualifications || [];
      this.initializeEducationForm();
    } catch (error) {
      console.error('Error loading qualifications:', error);
      this.error = 'Failed to load qualifications';
    }
  }

  async loadExperiences() {
    try {
      const experiences = await this.candidateDetailsService.getExperiences(this.candidateId).toPromise();
      this.experienceData = experiences || [];
      this.initializeExperienceForm();
    } catch (error) {
      console.error('Error loading experiences:', error);
      this.error = 'Failed to load experiences';
    }
  }

  async loadCertificates() {
    try {
      const certificates = await this.candidateDetailsService.getCertificates(this.candidateId).toPromise();
      this.certificationsData = certificates || [];
      this.initializeCertificateForm();
    } catch (error) {
      console.error('Error loading certificates:', error);
      this.error = 'Failed to load certificates';
    }
  }

  initializeEducationForm() {
    while (this.educationControls.length) {
      this.educationControls.removeAt(0);
    }
    if (this.educationData.length === 0) {
      this.addEducation();
    } else {
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
    }
  }

  initializeExperienceForm() {
    while (this.experienceControls.length) {
      this.experienceControls.removeAt(0);
    }
    if (this.experienceData.length === 0) {
      this.addExperience();
    } else {
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
    }
  }

  initializeCertificateForm() {
    while (this.certificationControls.length) {
      this.certificationControls.removeAt(0);
    }
    if (this.certificationsData.length === 0) {
      this.addCertification();
    } else {
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
  }

  // Save and proceed to the next step
  async saveAndProceed(nextStep: string) {
    if (this.currentStep === 'education') {
      await this.saveQualifications();
    } else if (this.currentStep === 'experience') {
      await this.saveExperiences();
    }
    this.currentStep = nextStep;
  }

  async saveQualifications() {
    try {
      await this.candidateDetailsService.saveQualifications(
        this.candidateId,
        this.educationControls.value
      ).toPromise();
      alert('Qualifications saved successfully!');
    } catch (error) {
      console.error('Error saving qualifications:', error);
      this.error = 'Failed to save qualifications';
    }
  }

  async saveExperiences() {
    try {
      await this.candidateDetailsService.saveExperiences(
        this.candidateId,
        this.experienceControls.value
      ).toPromise();
    } catch (error) {
      console.error('Error saving experiences:', error);
      this.error = 'Failed to save experiences';
    }
  }

  async saveCertificates() {
    try {
      await this.candidateDetailsService.saveCertificates(
        this.candidateId,
        this.certificationControls.value
      ).toPromise();
    } catch (error) {
      console.error('Error saving certificates:', error);
      this.error = 'Failed to save certificates';
    }
  }

  // Submit the form
  async onSubmit() {
    if (this.candidateForm.valid) {
      try {
        await this.saveCertificates();
        alert('All details submitted successfully!');
      } catch (error) {
        console.error('Error saving form:', error);
        alert('Failed to save details. Please try again.');
      }
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
}