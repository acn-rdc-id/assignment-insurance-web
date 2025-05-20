import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPurchaseInitialInfoComponent } from './policy-purchase-initial-info.component';

describe('PolicyPurchaseInitialInfoComponent', () => {
  let component: PolicyPurchaseInitialInfoComponent;
  let fixture: ComponentFixture<PolicyPurchaseInitialInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyPurchaseInitialInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyPurchaseInitialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});