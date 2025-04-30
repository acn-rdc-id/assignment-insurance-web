import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NxButtonComponent } from '@aposin/ng-aquila/button';
import { NxDropdownComponent, NxDropdownItemComponent } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldComponent, NxFormfieldModule, NxFormfieldSuffixDirective } from '@aposin/ng-aquila/formfield';
import { NxInputDirective } from '@aposin/ng-aquila/input';
import { NxDatefieldModule, NxDatepickerComponent, NxNativeDateModule, NxDatefieldDirective, NxDatepickerToggleComponent } from '@aposin/ng-aquila/datefield';
import { NxErrorComponent } from '@aposin/ng-aquila/base';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SubmitInitialInfo, SubmitInitialInfoSuccess} from '../../store/policy/policy.action';
import { PolicyState } from '../../store/policy/policy.state';

@Component({
  selector: 'app-policy-purchase-initial-info',
  imports: [FormsModule, 
    ReactiveFormsModule, 
    NxFormfieldComponent,
    NxDatefieldDirective,
    NxInputDirective,
    NxDatepickerToggleComponent,
    NxFormfieldSuffixDirective,
    NxDatepickerComponent,
    NxErrorComponent,
    NxFormfieldComponent,
    NxButtonComponent, 
    NxFormfieldModule,
    NxDropdownComponent,
    NxDropdownItemComponent,
    NxDatefieldModule,
    NxNativeDateModule,
    NxDatepickerComponent,
    RouterModule
  ],
  templateUrl: './policy-purchase-initial-info.component.html',
  styleUrl: './policy-purchase-initial-info.component.scss'
})

export class PolicyPurchaseInitialInfoComponent implements OnInit{

  infoForm!: FormGroup;

  submitted = false;
  
  today: Date = new Date();
  minAge: number = 18;
  maxAge: number = 65;

  maxDate: Date;
  minDate: Date;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.today.getFullYear() - this.minAge);

    this.minDate = new Date();
    this.minDate.setFullYear(this.today.getFullYear() - this.maxAge);
  }

  ngOnInit(): void {
    this.infoForm = this.fb.group({
      gender: new FormControl('', Validators.required),
      birthDate: new FormControl('', [
        Validators.required,
        this.birthdateValidator(this.minDate, this.maxDate)
      ])
    })

    this.store.select(PolicyState.getGender).subscribe(gender => {
      console.log('Gender:', gender);
    });
  }

  onBack(): void {
    console.log('Back button clicked');
  }

  onNext(): void {
    this.submitted = true;

    // API implementation
    
    // if (this.infoForm.valid) {
    //   const formData = this.infoForm.value;

    //   const payload = {
    //     gender: formData.gender,
    //     dateOfBirth: this.formatDate(formData.birthDate)
    //   };

    //   this.store.dispatch(new SubmitInitialInfo(payload));

    //   console.log('Sending to backend:', formData);
    // } else {
    //   this.infoForm.markAllAsTouched();
    //   console.log('Form is invalid');
    // }

    if(this.infoForm.valid) {
      const mockResponse = {
        referenceNumber: 'Q270178334',
        gender: this.infoForm.value.gender,
        dateOfBirth: this.formatDate(this.infoForm.value.birthDate),
        ageNearestBirthday: 24,
        plans: [
          {
            planName: 'Plan 200k',
            sumAssured: 200000,
            coverageTerm: '20 years',
            monthlyPremium: 90,
            yearlyPremium: 1080,
          },
          {
            planName: 'Plan 300k',
            sumAssured: 300000,
            coverageTerm: '20 years',
            monthlyPremium: 135,
            yearlyPremium: 1620,
          },
          {
            planName: 'Plan 500k',
            sumAssured: 500000,
            coverageTerm: '20 years',
            monthlyPremium: 225,
            yearlyPremium: 2700,
          }
        ]
      };

      this.store.dispatch(new SubmitInitialInfoSuccess(mockResponse));
      this.router.navigate(['/policy-purchase-plan']);
    } else {
      this.infoForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }

  formatDate(date: Date): string {
    // Format as "dd/MM/yyyy"
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  birthdateValidator(min: Date, max: Date) {
    return (control: any) => {
      const value = new Date(control.value);
      if (isNaN(value.getTime())) return { invalidDate: true };
      if (value < min || value > max) return { outOfRange: true };
      return null;
    };
  }
}
