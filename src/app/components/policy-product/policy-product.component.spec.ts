import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyProductComponent } from './policy-product.component';

describe('PolicyProductComponent', () => {
  let component: PolicyProductComponent;
  let fixture: ComponentFixture<PolicyProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
