import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsStepComponent } from './personal-details-step.component';

describe('PersonalDetailsStepComponent', () => {
  let component: PersonalDetailsStepComponent;
  let fixture: ComponentFixture<PersonalDetailsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalDetailsStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
