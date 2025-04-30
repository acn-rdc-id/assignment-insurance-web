import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPurchasePlanComponent } from './policy-purchase-plan.component';

describe('PolicyPurchasePlanComponent', () => {
  let component: PolicyPurchasePlanComponent;
  let fixture: ComponentFixture<PolicyPurchasePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyPurchasePlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyPurchasePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
