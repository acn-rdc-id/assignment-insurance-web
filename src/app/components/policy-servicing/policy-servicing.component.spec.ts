import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyServicingComponent } from './policy-servicing.component';

describe('PolicyServicingComponent', () => {
  let component: PolicyServicingComponent;
  let fixture: ComponentFixture<PolicyServicingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyServicingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyServicingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
