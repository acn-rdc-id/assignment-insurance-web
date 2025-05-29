import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyClaimDetailsComponent } from './policy-claim-details.component';

describe('PolicyClaimDetailsComponent', () => {
  let component: PolicyClaimDetailsComponent;
  let fixture: ComponentFixture<PolicyClaimDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyClaimDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
