import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {NxButtonComponent} from '@aposin/ng-aquila/button';
import {NxDropdownComponent, NxDropdownItemComponent,} from '@aposin/ng-aquila/dropdown';
import {NxFormfieldComponent, NxFormfieldModule, NxFormfieldSuffixDirective,} from '@aposin/ng-aquila/formfield';
import {NxInputDirective} from '@aposin/ng-aquila/input';
import {
  NxDatefieldDirective,
  NxDatefieldModule,
  NxDatepickerComponent,
  NxDatepickerToggleComponent,
  NxNativeDateModule,
} from '@aposin/ng-aquila/datefield';
import {NxErrorComponent} from '@aposin/ng-aquila/base';
import {Router, RouterModule} from '@angular/router';
import {Store} from '@ngxs/store';
import {SubmitInitialInfo} from '../../store/policy/policy-purchase.action';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {take} from 'rxjs';
import {PolicyService} from '../../services/policy.service';
import {HttpResponseBody} from '../../models/http-body.model';

@Component({
  selector: 'app-policy-purchase-initial-info',
  imports: [
    FormsModule,
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

  ],
  templateUrl: './policy-purchase-initial-info.component.html',
  styleUrl: './policy-purchase-initial-info.component.scss',
})
export class PolicyPurchaseInitialInfoComponent implements OnInit {
  @Input() nextStep!: () => void;
  @Input() prevStep!: () => void;

  infoForm!: FormGroup;

  submitted = false;

  today: Date = new Date();
  minAge: number = 18;
  maxAge: number = 65;

  maxDate: Date;
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private policyService: PolicyService
  ) {
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
        this.birthdateValidator(this.minDate, this.maxDate),
      ]),
    });

    this.store
      .select(PolicyPurchaseState.getGender)
      .pipe(take(1))
      .subscribe((gender) => {
        this.infoForm.get('gender')?.setValue(gender);
      });

    this.store
      .select(PolicyPurchaseState.getDateOfBirth)
      .pipe(take(1))
      .subscribe((dobString) => {
        if (dobString) {
          const [day, month, year] = dobString.split('/');
          const dateObj = new Date(+year, +month - 1, +day);
          this.infoForm.get('birthDate')?.setValue(dateObj);
        }
      });
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
    this.router.navigate(['/policy-product']);
  }

  onNext(): void {
    this.submitted = true;

    if (!this.infoForm.valid) {
      this.infoForm.markAllAsTouched();
      console.warn('⚠️ Form is invalid');
      return;
    }

    const formValues = this.infoForm.value;

    const requestPayload = {
      gender: formValues.gender.toUpperCase(),
      dateOfBirth: this.formatDate(formValues.birthDate)
    };

    this.policyService.getQuotationPlans(requestPayload).subscribe({
      next: (response: HttpResponseBody): void => {
        const isSuccess: boolean = response?.code === 200 && response?.data;

        if (isSuccess) {
          const initialInfo = {
            age: response.data.ageNearestBirthday,
            dateOfBirth: response.data.dateOfBirth,
            gender: this.formatCamelCase(response.data.gender),
            referenceNumber: response.data.referenceNumber,
            plans: response.data.plans
          };

          this.store.dispatch(new SubmitInitialInfo(initialInfo));
          this.nextStep();
        } else {
          console.warn('⚠️ API responded with an unexpected status or missing data:', response?.message);
        }
      },
      error: (error): void => {
        console.error('❌ API call failed:', error);
      }
    });
  }

  formatCamelCase(path: string): string {
    return path
      .split('-')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
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
