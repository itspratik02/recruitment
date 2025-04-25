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
  candidate :any ;
  candidateId: number = localStorage.getItem('id') ? Number(localStorage.getItem('id')) : 0;
  progress = 0;
  progressBar = true;
  edu: any[] = [];      
  exp: any[] = [];
  cert: any[] = [];
  
  degrees = ['SSC', 'HSC', 'B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'MBA', 'BCA', 'MCA', 'Diploma'];
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
      // this.loadQualifications(),
      // this.loadExperiences(),
      // this.loadCertificates(),
      this.loadCandidate()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  async loadCandidate() {
    this.candidateDetailsService.getCandidate(this.candidateId).subscribe({
      next: (data) => {
        this.candidate = data;
        // Map the properties correctly from backend model
        this.edu = this.candidate.qualifications || [];
        this.exp = this.candidate.experiences || [];
        this.cert = this.candidate.certificates || [];
        this.candidateName = this.candidate.fullName;
        console.log('Candidate data:', this.candidate);
        console.log('Qualifications:', this.edu);
        console.log('Experiences:', this.exp);
        console.log('Certificates:', this.cert);

        this.calculateProgress();
        // Initialize forms after data is loaded
        this.initializeEducationForm();
        this.initializeExperienceForm();
        this.initializeCertificateForm();
      },
      error: (err) => {
        console.error('Error loading candidate:', err);
        this.error = 'Failed to load candidate';
      }
    });
  }

  // async loadQualifications() {
  //   try {
  //     const qualifications = await this.candidateDetailsService.getQualifications(this.candidateId).toPromise();
  //     this.educationData = qualifications || [];
  //     console.log("Education data "+this.educationData);
  //     this.initializeEducationForm();
  //   } catch (error) {
  //     console.error('Error loading qualifications:', error);
  //     this.error = 'Failed to load qualifications';
  //   }
  // }

  // async loadExperiences() {
  //   try {
  //     const experiences = await this.candidateDetailsService.getExperiences(this.candidateId).toPromise();
  //     this.experienceData = experiences || [];
  //     console.log( this.experienceData);
  //     this.initializeExperienceForm();
  //   } catch (error) {
  //     console.error('Error loading experiences:', error);
  //     this.error = 'Failed to load experiences';
  //   }
  // }

  // async loadCertificates() {
  //   try {
  //     const certificates = await this.candidateDetailsService.getCertificates(this.candidateId).toPromise();
  //     this.certificationsData = certificates || [];
  //     console.log("Certification data "+this.certificationsData);
  //     this.initializeCertificateForm();
  //   } catch (error) {
  //     console.error('Error loading certificates:', error);
  //     this.error = 'Failed to load certificates';
  //   }
  // }

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
    try {
      if (this.currentStep === 'education') {
        await this.saveQualifications();
        this.edu = this.educationControls.value;
      } else if (this.currentStep === 'experience') {
        await this.saveExperiences();
        this.exp = this.experienceControls.value;
      }
      this.isEditMode = false;
      this.currentStep = nextStep;
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save. Please try again.');
    }
  }

  async saveQualifications() {
    try {
      // Only send the newly added education entries
      const newQualifications = this.educationControls.value;
      await this.candidateDetailsService.saveQualifications(
        this.candidateId,
        newQualifications
      ).toPromise();
      
      // Update local data and recalculate progress
      this.edu = await this.candidateDetailsService.getCandidate(this.candidateId).toPromise().then(data => data.qualifications || []);
      this.calculateProgress();
      alert('Qualifications saved successfully!');
    } catch (error) {
      console.error('Error saving qualifications:', error);
      this.error = 'Failed to save qualifications';
    }
  }

  async saveExperiences() {
    try {
      const newExperiences = this.experienceControls.value;
      await this.candidateDetailsService.saveExperiences(
        this.candidateId,
        newExperiences
      ).toPromise();
      alert('Experiences saved successfully!');

      // Update local data
      this.exp = await this.candidateDetailsService.getCandidate(this.candidateId).toPromise().then(data => data.experiences || []);
    } catch (error) {
      console.error('Error saving experiences:', error);
      this.error = 'Failed to save experiences';
    }
  }

  async saveCertificates() {
    try {
      const newCertificates = this.certificationControls.value;
      await this.candidateDetailsService.saveCertificates(
        this.candidateId,
        newCertificates
      ).toPromise();
      alert('Certificates saved successfully!');
      // Update local data
      this.cert = await this.candidateDetailsService.getCandidate(this.candidateId).toPromise().then(data => data.certificates || []);
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
        this.cert = this.certificationControls.value;
        this.isEditMode = false;
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
      // When entering edit mode, populate the form with current data
      if (this.currentStep === 'education' && this.edu?.length > 0) {
        while (this.educationControls.length) {
          this.educationControls.removeAt(0);
        }
        this.edu.forEach(education => {
          this.educationControls.push(
            this.fb.group({
              collegeName: [education.collegeName, Validators.required],
              university: [education.university, Validators.required],
              degree: [education.degree, Validators.required],
              specialization: [education.specialization, Validators.required],
              startYear: [education.startYear, Validators.required],
              endYear: [education.endYear, Validators.required],
              percentage: [education.percentage, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
            })
          );
        });
      } else if (this.currentStep === 'experience' && this.exp?.length > 0) {
        while (this.experienceControls.length) {
          this.experienceControls.removeAt(0);
        }
        this.exp.forEach(experience => {
          this.experienceControls.push(
            this.fb.group({
              companyName: [experience.companyName, Validators.required],
              role: [experience.role, Validators.required],
              startDate: [experience.startDate, Validators.required],
              endDate: [experience.endDate],
              description: [experience.description, Validators.required]
            })
          );
        });
      } else if (this.currentStep === 'certifications' && this.cert?.length > 0) {
        while (this.certificationControls.length) {
          this.certificationControls.removeAt(0);
        }
        this.cert.forEach(certification => {
          this.certificationControls.push(
            this.fb.group({
              title: [certification.title, Validators.required],
              issuedBy: [certification.issuedBy, Validators.required],
              certificateURL: [certification.certificateURL, Validators.required]
            })
          );
        });
      }
    }
  }

  // Update the navigateToStep method to reset edit mode
  // navigateToStep(step: string) {
  //   this.isEditMode = false;
  //   this.currentStep = step;
  // }

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
    this.isEditMode = false;
    this.currentStep = step;
  }

  hasSSC(): boolean {
    return this.edu?.some(e => e.degree === 'SSC') ?? false;
  }

  hasHSC(): boolean {
    return this.edu?.some(e => e.degree === 'HSC') ?? false;
  }

  hasHigherEducation(): boolean {
    return this.edu?.some(e => 
      ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'MBA', 'BCA', 'MCA', 'Diploma'].includes(e.degree)
    ) ?? false;
  }

  calculateProgress() {
    let completedRequirements = 0;
    if (this.hasSSC()) completedRequirements++;
    if (this.hasHSC()) completedRequirements++;
    if (this.hasHigherEducation()) completedRequirements++;

    this.progress = (completedRequirements / 3) * 100;
    return this.progress;
  }

  getProgressColor(): string {
    if (this.progress < 33) return 'bg-red-500';
    if (this.progress < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  }
}