import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-resume-upload-popup',
  templateUrl: './resume-upload-component.component.html',
  standalone: true,
  styleUrls: ['./resume-upload-component.component.css']
})
export class ResumeUploadPopupComponent {
  @Output() resumeUploaded = new EventEmitter<File>();  // Emit file on resume upload

  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.selectedFile) {
      this.resumeUploaded.emit(this.selectedFile);  // Emit selected file
    } else {
      alert("Please select a file to upload.");
    }
  }

  
}
