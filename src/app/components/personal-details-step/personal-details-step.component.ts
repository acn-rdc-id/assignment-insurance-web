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
import {Subject, takeUntil} from 'rxjs';
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
  @Input() nextStep!: () => void;
  @Input() prevStep!: () => void;

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

  getFormFieldMappings(): { controlName: string, selector: (state: any) => any }[] {
    return [
      { controlName: 'title', selector: PolicyPurchaseState.getPersonalTitle },
      { controlName: 'gender', selector: PolicyPurchaseState.getGender },
      { controlName: 'dateOfBirth', selector: PolicyPurchaseState.getDateOfBirth },
      { controlName: 'fullName', selector: PolicyPurchaseState.getPersonalFullName },
      { controlName: 'nationality', selector: PolicyPurchaseState.getPersonalNationality },
      { controlName: 'idNo', selector: PolicyPurchaseState.getPersonalIdNo },
      { controlName: 'otherId', selector: PolicyPurchaseState.getPersonalOtherId },
      { controlName: 'isUsPerson', selector: PolicyPurchaseState.getPersonalIsUsPerson },
      { controlName: 'countryOfBirth', selector: PolicyPurchaseState.getPersonalCountryOfBirth },
      { controlName: 'isSmoker', selector: PolicyPurchaseState.getPersonalIsSmoker },
      { controlName: 'cigarettesPerDay', selector: PolicyPurchaseState.getPersonalCigarettesPerDay },
      { controlName: 'countryCode', selector: PolicyPurchaseState.getPersonalCountryCode },
      { controlName: 'mobileNo', selector: PolicyPurchaseState.getPersonalMobileNo },
      { controlName: 'occupation', selector: PolicyPurchaseState.getPersonalOccupation },
      { controlName: 'email', selector: PolicyPurchaseState.getPersonalEmail },
      { controlName: 'transactionPurpose', selector: PolicyPurchaseState.getPersonalTransactionPurpose }
    ];
  }

  populateFormFieldsFromState(): void {
    const disableFields = ['gender', 'dateOfBirth'];
    const fieldMappings = this.getFormFieldMappings();

    fieldMappings.forEach(({ controlName, selector }) => {
      this.store.select(selector).subscribe(value => {
        const control = this.formGroup.get(controlName);
        if (control) {
          control.setValue(value);
          if (disableFields.includes(controlName)) {
            control.disable();
          }
        }
      });
    });
  }

  onFormChange(): void {
    this.formGroup.get('idNo')?.valueChanges
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(value => {
          if (typeof value === 'string') {
            const formattedString = this.nricPipe.transform(value);
            this.formGroup.patchValue({idNo: formattedString}, {emitEvent: false});
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

  }

  onNext(): void {
    if (this.formGroup.valid) {
      const formValue: PolicyPersonalDetails = this.formGroup.getRawValue();

      const userPersonalDetailsPayload: PolicyPersonalDetails = {
        ...formValue,
      };

      this.store.dispatch(new SubmitPersonalDetailsInfo(userPersonalDetailsPayload));
      this.nextStep();
    } else {
      console.log("Form is invalid, cannot proceed.");
    }
  }

  onBack(): void {
    this.prevStep();
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
