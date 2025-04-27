import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeUploadPopupComponent } from './resume-upload-component.component';

describe('ResumeUploadComponentComponent', () => {
  let component: ResumeUploadPopupComponent;
  let fixture: ComponentFixture<ResumeUploadPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeUploadPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeUploadPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
