import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NxButtonComponent} from '@aposin/ng-aquila/button';
import {NxDropdownComponent, NxDropdownItemComponent} from '@aposin/ng-aquila/dropdown';
import {NxFormfieldComponent, NxFormfieldModule, NxFormfieldSuffixDirective} from '@aposin/ng-aquila/formfield';
import {NxInputDirective} from '@aposin/ng-aquila/input';
import {
  NxDatefieldDirective,
  NxDatefieldModule,
  NxDatepickerComponent,
  NxDatepickerToggleComponent,
  NxNativeDateModule
} from '@aposin/ng-aquila/datefield';
import {NxErrorComponent} from '@aposin/ng-aquila/base';
import {Router, RouterModule} from '@angular/router';
import {Store} from '@ngxs/store';
import {SubmitInitialInfoSuccess} from '../../store/policy/policy-purchase.action';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import { take } from 'rxjs';
import { PolicyService } from '../../services/policy.service';
import {NxStepperNextDirective} from '@aposin/ng-aquila/progress-stepper';

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
    RouterModule,
    NxStepperNextDirective,
  ],
  templateUrl: './policy-purchase-initial-info.component.html',
  styleUrl: './policy-purchase-initial-info.component.scss'
})

export class PolicyPurchaseInitialInfoComponent implements OnInit{
  @Input() nextStep!: () => void;
  @Input() prevStep!: () => void;

  infoForm!: FormGroup;

  submitted = false;

  today: Date = new Date();
  minAge: number = 18;
  maxAge: number = 65;

  maxDate: Date;
  minDate: Date;

  constructor(private fb: FormBuilder, private store: Store, private router: Router, private policyService: PolicyService) {
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

    this.store.select(PolicyPurchaseState.getGender).pipe(take(1)).subscribe(gender => {
      this.infoForm.get('gender')?.setValue(gender);
    });

    this.store.select(PolicyPurchaseState.getDateOfBirth).pipe(take(1)).subscribe(dobString => {
      if (dobString) {
        const [day, month, year] = dobString.split('/');
        const dateObj = new Date(+year, +month - 1, +day);
        this.infoForm.get('birthDate')?.setValue(dateObj);
      }
    })
  }

  parseDateFromString(dateStr: string): Date | null {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  }

  onBack(): void {
    console.log('Back button clicked');
    this.prevStep();
  }

  onNext(): void {
    this.submitted = true;
    this.nextStep();
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

    // if(this.infoForm.valid) {
    //   const formData = this.infoForm.value;

    //   const payload = {
    //     gender: formData.gender,
    //     dateOfBirth: this.formatDate(formData.dateOfBirth)
    //   };

    //   this.policyService.getPlans(payload).subscribe(plans => {
    //       const response = {
    //         quotationNumber: '',
    //         plan: undefined,
    //         personalDetails: {
    //           gender: payload.gender,
    //           dateOfBirth: payload.dateOfBirth,
    //           age: 0,
    //           title: '',
    //           fullName: '',
    //           nationality: '',
    //           idNo: '',
    //           otherId: '',
    //           isUsPerson: false,
    //           countyOfBirth: '',
    //           isSmoker: false,
    //           cigarettesPerDay: 0,
    //           countryCode: '',
    //           mobileNo: '',
    //           occupation: '',
    //           email: '',
    //           transactionPurpose: ''
    //         }, 
    //         plans
    //       };

    //       const response = {
    //         gender: payload.gender,
    //         dateOfBirth: payload.dateOfBirth
    //       }

    //       this.store.dispatch(new SubmitInitialInfo(response));
    //       this.router.navigate(['/policy-purchase-plan']);
    //     });
    //   } else {
    //     this.infoForm.markAllAsTouched();
    //     console.log('Form is invalid');
    //   }

      if(this.infoForm.valid) {
      const mockResponse = {
        quotationNumber: 'Q270178334',
        plan: undefined,
        personalDetails: {
          gender: this.infoForm.value.gender,
          dateOfBirth: this.formatDate(this.infoForm.value.birthDate),
          age: 25,
          title: '',
          fullName: '',
          nationality: '',
          idNo: '',
          otherId: '',
          isUsPerson: false,
          countryOfBirth: '',
          isSmoker: false,
          cigarettesPerDay: 0,
          countryCode: '',
          mobileNo: '',
          occupation: '',
          email: '',
          transactionPurpose: ''
        }, 
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
      // this.router.navigate(['/policy-purchase-plan']);
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
