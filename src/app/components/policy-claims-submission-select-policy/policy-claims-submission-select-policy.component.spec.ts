import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyClaimsSubmissionSelectPolicyComponent } from './policy-claims-submission-select-policy.component';

describe('PolicyClaimsSubmissionSelectPolicyComponent', () => {
  let component: PolicyClaimsSubmissionSelectPolicyComponent;
  let fixture: ComponentFixture<PolicyClaimsSubmissionSelectPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyClaimsSubmissionSelectPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyClaimsSubmissionSelectPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
