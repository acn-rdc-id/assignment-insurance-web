import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPurchaseInsuredInfoComponent } from './policy-purchase-insured-info.component';

describe('PolicyPurchaseInsuredInfoComponent', () => {
  let component: PolicyPurchaseInsuredInfoComponent;
  let fixture: ComponentFixture<PolicyPurchaseInsuredInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyPurchaseInsuredInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyPurchaseInsuredInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
