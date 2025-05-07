import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NxFormfieldAppendixDirective, NxFormfieldComponent} from '@aposin/ng-aquila/formfield';
import {NxButtonComponent, NxIconButtonComponent} from '@aposin/ng-aquila/button';
import {NxStepperPreviousDirective} from '@aposin/ng-aquila/progress-stepper';
import {NxInputDirective} from '@aposin/ng-aquila/input';
import {NxColComponent, NxLayoutComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import {NxDropdownComponent, NxDropdownItemComponent} from '@aposin/ng-aquila/dropdown';
import {NxIconComponent} from '@aposin/ng-aquila/icon';
import {NxSwitcherComponent} from '@aposin/ng-aquila/switcher';
import {NxPopoverComponent, NxPopoverTriggerDirective} from '@aposin/ng-aquila/popover';
import {debounceTime, Subject, takeUntil} from 'rxjs';
import {IdType} from '../../enums/id-type.enum';
import {Store} from '@ngxs/store';
import {SubmitPersonalDetailsInfo} from '../../store/policy/policy-purchase.action';
import {PolicyPersonalDetails} from '../../models/policy.model';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {NricPipe} from '../../pipes/nric.pipe';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-personal-details-step',
  imports: [
    NxFormfieldComponent,
    NxButtonComponent,
    NxStepperPreviousDirective,
    NxInputDirective,
    ReactiveFormsModule,
    NxColComponent,
    NxDropdownComponent,
    NxDropdownItemComponent,
    NxFormfieldAppendixDirective,
    NxIconButtonComponent,
    NxIconComponent,
    NxLayoutComponent,
    NxRowComponent,
    NxSwitcherComponent,
    NxPopoverComponent,
    NxPopoverTriggerDirective,
    NgClass
  ],
  providers: [NricPipe],
  templateUrl: './personal-details-step.component.html',
  styleUrl: './personal-details-step.component.scss'
})
export class PersonalDetailsStepComponent implements OnInit, OnDestroy {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() prevStep!: () => void;
  @Input() nextSubStep!: () => void;

  FIELD_OPTIONS = {
    title: [
      { value: 'Mr', label: 'Mr' },
      { value: 'Mrs', label: 'Mrs' },
    ],
    nationality: [
      { value: 'MY', label: 'Malaysian' },
    ],
    countryOfBirth: [
      { value: 'MY', label: 'Malaysia' },
    ],
    countryCode: [
      { value: '60', label: '60' },
    ],
    occupation: [
      { value: 'H001', label: 'Administrators' },
      { value: 'H002', label: 'Analyst (System/Financial/Business)' },
      { value: 'H003', label: 'Assistant (Dental/Lab/Legal/Shop/Accounts)' },
      { value: 'H004', label: 'Babysitter' },
      { value: 'H005', label: 'Banker' },
      { value: 'H006', label: 'Beautician/Make-up Artist' },
    ],
    transactionPurpose: [
      { value: 'PRO', label: 'Protection' },
      { value: 'PRORET', label: 'Protection, Retirement' },
      { value: 'LOANPRO', label: 'Loan Protection' },
      { value: 'PROSAVINV', label: 'Protection, Savings, Investment' },
      { value: 'EDU', label: 'Education' },
      { value: 'PART', label: 'Partnership' },
      { value: 'EB', label: 'Employee Benefit' },
      { value: 'KEYM', label: 'Keyman' },
      { value: 'OTH', label: 'Others' },
    ],
  };

  idType: typeof IdType = IdType;
  nricPipe: NricPipe = inject(NricPipe);
  store: Store = inject(Store);
  unsubscribe$ = new Subject();
  usPersonError: boolean = false;
  emailError: boolean = false;
  idNoError: boolean = false;

  populateFormFieldsFromState(): void {
    const disableFields = ['gender', 'dateOfBirth'];

    this.store.select(PolicyPurchaseState.getPersonalDetails)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(details => {
        if (!details) return;

        Object.entries(details).forEach(([key, value]) => {
          const control = this.formGroup.get(key);
          if (control) {
            control.setValue(value);
            if (disableFields.includes(key)) {
              control.disable();
            }
          }
        });
      });
  }

  onFormChange(): void {
    this.formGroup.get('idNo')?.valueChanges
      .pipe(
        debounceTime(800),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(value => {
        if (typeof value === 'string') {
          const formattedString = this.nricPipe.transform(value);
          this.formGroup.patchValue({ idNo: formattedString }, { emitEvent: false });

          const gender = this.formGroup.get('gender')?.value;
          const dob = this.formGroup.get('dateOfBirth')?.value;

          if (gender && dob && formattedString) {
            const isValid = this.nricPipe.validateNric(formattedString, gender, dob);

            this.idNoError = !isValid;
            if (this.idNoError) {
              this.formGroup.get('idNo')?.setErrors({ invalidNric: true });
            } else {
              this.formGroup.get('idNo')?.setErrors(null);
            }
          }
        }
      });

    this.formGroup.get('isSmoker')?.valueChanges
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((isSmoker: boolean) => {
          if (isSmoker) {
            this.formGroup.get('cigarettesPerDay')?.enable();
          } else {
            this.formGroup.get('cigarettesPerDay')?.disable();
            this.formGroup.get('cigarettesPerDay')?.setValue(0);
          }
        });

    this.formGroup.get('isUsPerson')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isUs: boolean) => {
        this.usPersonError = isUs;
      });

    this.formGroup.get('email')?.statusChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        const emailControl = this.formGroup.get('email');
        this.emailError = !!emailControl && emailControl.invalid && emailControl.touched;
      });
  }

  onSubNext(): void {
    if (this.formGroup.valid && !this.usPersonError) {
      const formValue = this.formGroup.getRawValue();

      const userPersonalDetailsPayload: PolicyPersonalDetails = {
        ...formValue,
        age: this.getAgeFromSession()
      };

      this.store.dispatch(new SubmitPersonalDetailsInfo(userPersonalDetailsPayload));
      this.nextSubStep();
    } else {
      console.log("Form is invalid, cannot proceed.");
    }
  }

  onBack(): void {
    this.prevStep();
  }

  getAgeFromSession(): number | undefined {
    return this.store.selectSnapshot(PolicyPurchaseState.getAge);
  }

  ngOnInit(): void {
    this.onFormChange();
    this.populateFormFieldsFromState();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('');
    this.unsubscribe$.complete();
  }
}
