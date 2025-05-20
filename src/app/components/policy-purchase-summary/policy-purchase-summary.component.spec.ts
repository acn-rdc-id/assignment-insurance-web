import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPurchaseSummaryComponent } from './policy-purchase-summary.component';

describe('PolicyPurchaseSummaryComponent', () => {
  let component: PolicyPurchaseSummaryComponent;
  let fixture: ComponentFixture<PolicyPurchaseSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyPurchaseSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyPurchaseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
