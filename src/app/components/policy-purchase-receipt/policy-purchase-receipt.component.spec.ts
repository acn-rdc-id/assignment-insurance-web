import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPurchaseReceiptComponent } from './policy-purchase-receipt.component';

describe('PolicyPurchaseReceiptComponent', () => {
  let component: PolicyPurchaseReceiptComponent;
  let fixture: ComponentFixture<PolicyPurchaseReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyPurchaseReceiptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyPurchaseReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
