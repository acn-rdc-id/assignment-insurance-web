import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyClaimsSubmissionUploadDocComponent } from './policy-claims-submission-upload-doc.component';

describe('PolicyClaimsSubmissionUploadDocComponent', () => {
  let component: PolicyClaimsSubmissionUploadDocComponent;
  let fixture: ComponentFixture<PolicyClaimsSubmissionUploadDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyClaimsSubmissionUploadDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyClaimsSubmissionUploadDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
