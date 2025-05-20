import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
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
import {PostQuotationPlans} from '../../store/policy/policy-purchase.action';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {Subject, take} from 'rxjs';
import {HttpErrorBody} from '../../models/http-body.model';
import {MessageModalData} from '../../models/message-modal-data.model';
import {MessageModalComponent} from '../message-modal/message-modal.component';
import {NxDialogService, NxModalRef} from '@aposin/ng-aquila/modal';

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
export class PolicyPurchaseInitialInfoComponent implements OnInit, OnDestroy {
  @Input() nextStep!: () => void;
  @Input() prevStep!: () => void;
  private dialogService = inject(NxDialogService);
  private dialogRef?: NxModalRef<any>;
  unsubscribe$ = new Subject();

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

    const payload = {
      gender: formValues.gender.toUpperCase(),
      dateOfBirth: this.formatDate(formValues.birthDate)
    };

    this.store.dispatch(new PostQuotationPlans(payload)).subscribe({
      complete: () => {
        this.nextStep();
      },
      error: (err: HttpErrorBody) => {
        const messageData: MessageModalData = {
          header: 'Error',
          message: err.message ?? 'Unexpected error occurred.'
        };
        this.openErrorModal(messageData);
      }
    });
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

  private openErrorModal(messageData?: MessageModalData): void {
    this.dialogRef = this.dialogService.open(MessageModalComponent, {
      data: messageData,
      disableClose: true,
      ariaLabel: 'Error dialog'
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('');
    this.unsubscribe$.complete();
  }
}
