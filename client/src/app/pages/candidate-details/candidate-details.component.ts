import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DatePipe } from '@angular/common';
import { CandidateDetailsService } from '../../services/candidate-details.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CandidateComponent } from '../candidate/candidate.component';

interface Education {
  id?: number;
  educationId?: number;
  collegeName: string;
  university: string;
  degree: string;
  specialization: string;
  startYear: number;
  endYear: number;
  percentage: number;
}

interface Experience {
  id?: number;
  experienceId?: number;
  companyName: string;
  role: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

interface Certificate {
  id?: number;
  certificateId?: number;
  title: string;
  issuedBy: string;
  certificateURL: string;
}

@Component({
  selector: 'app-candidate-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, HttpClientModule,CandidateComponent],
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
  
  addNewMode = false;
  
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
    console.log(this.progress);
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
      } else if (this.currentStep === 'certifications') {
        await this.saveCertificates();
        this.cert = this.certificationControls.value;
      }
      this.isEditMode = false; // Turn off edit mode after saving
      this.currentStep = nextStep;
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save. Please try again.');
    }
  }

  // Updated save methods to prevent duplication
  async saveQualifications() {
    try {
      const currentQualifications = this.educationControls.value;
      const updatedQualifications = currentQualifications.map((qualification: any) => {
        if (qualification.id) {
          return qualification; // Existing record, no duplication
        } else {
          delete qualification.id; // Ensure new records don't have an ID
          return qualification;
        }
      });



      await this.candidateDetailsService.saveQualifications(
        this.candidateId,
        updatedQualifications
      ).toPromise();
      
      // Refresh data from server
      const data = await this.candidateDetailsService.getCandidate(this.candidateId).toPromise();
      this.edu = data.qualifications || [];
      this.calculateProgress();
      alert('Qualifications saved successfully!');
      this.isEditMode = false;
      this.addNewMode = false;
    } catch (error) {
      console.error('Error saving qualifications:', error);
      this.error = 'Failed to save qualifications';
      alert('Failed to save. Please ensure you are logged in and try again.');
    }
  }

  // Updated save methods to prevent duplication
  async saveExperiences() {
    try {
      const currentExperiences = this.experienceControls.value;
      const updatedExperiences = currentExperiences.map((experience: any) => {
        if (experience.id) {
          return experience; // Existing record, no duplication
        } else {
          delete experience.id; // Ensure new records don't have an ID
          return experience;
        }
      });

      await this.candidateDetailsService.saveExperiences(
        this.candidateId,
        updatedExperiences
      ).toPromise();

      // Refresh data from server
      const data = await this.candidateDetailsService.getCandidate(this.candidateId).toPromise();
      this.exp = data.experiences || [];
      alert('Experiences saved successfully!');
      this.isEditMode = false;
      this.addNewMode = false;
    } catch (error) {
      console.error('Error saving experiences:', error);
      this.error = 'Failed to save experiences';
      alert('Failed to save. Please ensure you are logged in and try again.');
    }
  }

  // Updated save methods to prevent duplication
  async saveCertificates() {
    try {
      const currentCertificates = this.certificationControls.value;
      const updatedCertificates = currentCertificates.map((certificate: any) => {
        if (certificate.id) {
          return certificate; // Existing record, no duplication
        } else {
          delete certificate.id; // Ensure new records don't have an ID
          return certificate;
        }
      });

      await this.candidateDetailsService.saveCertificates(
        this.candidateId,
        updatedCertificates
      ).toPromise();

      // Refresh data from server
      const data = await this.candidateDetailsService.getCandidate(this.candidateId).toPromise();
      this.cert = data.certificates || [];
      alert('Certificates saved successfully!');
      this.isEditMode = false;
      this.addNewMode = false;
    } catch (error) {
      console.error('Error saving certificates:', error);
      this.error = 'Failed to save certificates';
      alert('Failed to save. Please ensure you are logged in and try again.');
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

  closeEditMode() {
    this.isEditMode = false;
  }

  toggleEditMode() {
    
    this.isEditMode = true;
    this.addNewMode = false;
    if (this.currentStep === 'education' && this.edu?.length > 0) {
      while (this.educationControls.length) {
        this.educationControls.removeAt(0);
      }
      this.edu.forEach(education => {
        this.educationControls.push(
          this.fb.group({
            id: [education.educationId], // Store the backend ID
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
            id: [experience.experienceId], // Store the backend ID
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
            id: [certification.certificateId], // Store the backend ID
            title: [certification.title, Validators.required],
            issuedBy: [certification.issuedBy, Validators.required],
            certificateURL: [certification.certificateURL, Validators.required]
          })
        );
      });
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
    const educationToRemove = this.educationControls.at(index).value;
    if (educationToRemove.id) {
      this.candidateDetailsService.deleteQualification(educationToRemove.id).subscribe({
        next: async () => {
          this.educationControls.removeAt(index);
          // Refresh data from server
          const data = await this.candidateDetailsService.getCandidate(this.candidateId).toPromise();
          this.edu = data.qualifications || [];
          this.calculateProgress();
          alert('Education entry deleted successfully!');
        },
        error: (err: any) => {
          console.error('Error deleting education entry:', err);
          alert('Failed to delete education entry. Please try again.');
        }
      });
    } else {
      this.educationControls.removeAt(index);
    }
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
    const experienceToRemove = this.experienceControls.at(index).value;
    if (experienceToRemove.id) {
      this.candidateDetailsService.deleteExperience(experienceToRemove.id).subscribe({
        next: async () => {
          this.experienceControls.removeAt(index);
          // Refresh data from server
          const data = await this.candidateDetailsService.getCandidate(this.candidateId).toPromise();
          this.exp = data.experiences || [];
          alert('Experience entry deleted successfully!');
        },
        error: (err: any) => {
          console.error('Error deleting experience entry:', err);
          alert('Failed to delete experience entry. Please try again.');
        }
      });
    } else {
      this.experienceControls.removeAt(index);
    }
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
    const certificationToRemove = this.certificationControls.at(index).value;
    if (certificationToRemove.id) {
      this.candidateDetailsService.deleteCertificate(certificationToRemove.id).subscribe({
        next: async () => {
          this.certificationControls.removeAt(index);
          // Refresh data from server
          const data = await this.candidateDetailsService.getCandidate(this.candidateId).toPromise();
          this.cert = data.certificates || [];
          alert('Certification entry deleted successfully!');
        },
        error: (err: any) => {
          console.error('Error deleting certification entry:', err);
          alert('Failed to delete certification entry. Please try again.');
        }
      });
    } else {
      this.certificationControls.removeAt(index);
    }
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
    this.candidateDetailsService.setProgress(this.progress);
    return this.progress;
  }

  getProgressColor(): string {
    if (this.progress < 33) return 'bg-red-500';
    if (this.progress < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  toggleAddMode() {
    this.addNewMode = true;
    this.isEditMode = false;
    if (this.currentStep === 'education') {
      this.educationControls.push(
        this.fb.group({
          id: [null],
          collegeName: ['', Validators.required],
          university: ['', Validators.required],
          degree: ['', Validators.required],
          specialization: ['', Validators.required],
          startYear: ['', Validators.required],
          endYear: ['', Validators.required],
          percentage: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
        })
      );
    } else if (this.currentStep === 'experience') {
      this.experienceControls.push(
        this.fb.group({
          id: [null],
          companyName: ['', Validators.required],
          role: ['', Validators.required],
          startDate: ['', Validators.required],
          endDate: [''],
          description: ['', Validators.required]
        })
      );
    } else if (this.currentStep === 'certifications') {
      this.certificationControls.push(
        this.fb.group({
          id: [null],
          title: ['', Validators.required],
          issuedBy: ['', Validators.required],
          certificateURL: ['', Validators.required]
        })
      );
    }
  }

  cancelAdd() {
    this.addNewMode = false;
    // Remove the last form control (the new one being added)
    if (this.currentStep === 'education') {
      this.educationControls.removeAt(this.educationControls.length - 1);
    } else if (this.currentStep === 'experience') {
      this.experienceControls.removeAt(this.experienceControls.length - 1);
    } else if (this.currentStep === 'certifications') {
      this.certificationControls.removeAt(this.certificationControls.length - 1);
    }
  }
}