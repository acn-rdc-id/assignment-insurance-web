import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyClaimsSubmissionComponent } from './policy-claims-submission.component';

describe('PolicyClaimsSubmissionComponent', () => {
  let component: PolicyClaimsSubmissionComponent;
  let fixture: ComponentFixture<PolicyClaimsSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyClaimsSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyClaimsSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
