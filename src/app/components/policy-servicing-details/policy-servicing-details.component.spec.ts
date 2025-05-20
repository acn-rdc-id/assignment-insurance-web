import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyServicingDetailsComponent } from './policy-servicing-details.component';

describe('PolicyServicingDetailsComponent', () => {
  let component: PolicyServicingDetailsComponent;
  let fixture: ComponentFixture<PolicyServicingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyServicingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyServicingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
