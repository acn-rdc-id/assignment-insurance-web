import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyServicingBeneficiaryComponent } from './policy-servicing-beneficiary.component';

describe('PolicyServicingBeneficiaryComponent', () => {
  let component: PolicyServicingBeneficiaryComponent;
  let fixture: ComponentFixture<PolicyServicingBeneficiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyServicingBeneficiaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyServicingBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
