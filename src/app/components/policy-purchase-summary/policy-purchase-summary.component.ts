import {Component, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NxColComponent, NxLayoutComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import {CommonModule} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {NxTableCellComponent, NxTableComponent, NxTableRowComponent,} from '@aposin/ng-aquila/table';
import {TermsConditions} from '../../models/policy.model';
import {Store} from '@ngxs/store';
import {NxCheckboxComponent} from '@aposin/ng-aquila/checkbox';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NxButtonComponent} from '@aposin/ng-aquila/button';
import {NxIconComponent} from '@aposin/ng-aquila/icon';
import {NxDialogService, NxModalCloseDirective} from '@aposin/ng-aquila/modal';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {SUMMARY_FORM_LABELS, SUMMARY_FORM_ORDERS} from '../../constants/form.costants';
import {PolicyService} from '../../services/policy.service';
import {HttpResponseBody} from '../../models/http-body.model';
import {UserState} from '../../store/user/user.state';
import {QuotationSummaryComponent} from '../quotation-summary/quotation-summary.component';

type MyDialogResult = 'success' | 'fail';

@Component({
  selector: 'app-policy-purchase-summary',
  imports: [
    NxLayoutComponent,
    NxColComponent,
    NxRowComponent,
    NxTableCellComponent,
    NxTableComponent,
    NxTableRowComponent,
    CommonModule,
    NxCheckboxComponent,
    ReactiveFormsModule,
    NxButtonComponent,
    NxIconComponent,
    NxModalCloseDirective,
    QuotationSummaryComponent
  ],
  templateUrl: './policy-purchase-summary.component.html',
  styleUrl: './policy-purchase-summary.component.scss'
})

export class PolicyPurchaseSummaryComponent implements OnInit {
  policyService: PolicyService = inject(PolicyService);

  quotationId: number = 0;
  premiumMode: string = "";
  duration: number = 0;
  planInfo = "";
  finalConfirmation: FormControl<boolean | null> | undefined;
  termsAndConditions:Array<TermsConditions> = [];
  displayPersonalInfo: any[] = [];

  form: FormGroup;
  formArray: FormArray;

  @ViewChild('paymentDialog') paymentDialog!: TemplateRef<any>;
  modalRef: any;
  actionResult?: MyDialogResult;
  paymentStatus: number | null = null;

  @Input() nextSubStep!: () => void;
  @Input() prevSubStep!: () => void;
  @Output() paymentResult = new EventEmitter<number>();

  modeToDurationMap: Record<string, number> = {
    MONTHLY: 1,
    YEARLY: 12,
  };

  constructor(
    private sanitizer: DomSanitizer,
    private store: Store,
    private fb:FormBuilder,
    private dialogService: NxDialogService,
    // private deepCopy: DeepCopyService
  ) {

    //stores checked terms
    this.form = this.fb.group({
      terms: this.fb.array([]),
    });
    this.formArray = this.form.get('terms') as FormArray;

   }

  preparePersonalInfo(): void {
    // todo revamp more
    const personalDetails = this.store.selectSnapshot(PolicyPurchaseState.getPersonalDetails);
    if (!personalDetails) {
      this.displayPersonalInfo = [];
      return;
    }

    this.displayPersonalInfo = SUMMARY_FORM_ORDERS
      .map((key): { label: string; content: string } | null => {
        if (key === 'mobileNo') {
          const { countryCode, mobileNo } = personalDetails;
          if (!mobileNo && !countryCode) return null;

          const combined = `${countryCode ?? ''}-${mobileNo ?? ''}`.replace(/^-/, '');
          return {
            label: SUMMARY_FORM_LABELS[key] ?? key,
            content: combined,
          };
        }

        const value = personalDetails[key as keyof typeof personalDetails];
        if (value !== null && value !== undefined) {
          return {
            label: SUMMARY_FORM_LABELS[key] ?? key,
            content: this.formatBooleanValue(value),
          };
        }

        return null;
      })
      .filter(
        (item): item is { label: string; content: string } => item !== null
      );
  }


  private formatBooleanValue(value: any): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value;
  }

  getFormControlAt(index: number): FormControl {
    // return this.termsFormArray.at(index) as FormControl;
    return this.formArray.at(index) as FormControl;
  }

  get termsFormArray(): FormArray {
    return this.form.get('terms') as FormArray;
  }

  loadTermsAndConditions(){
    this.termsAndConditions = this.store.selectSnapshot(PolicyPurchaseState.getTermsAndConditions);
    this.formArray.clear();

    this.termsAndConditions.forEach(term => {
      const control = term.isRequired === 1
        ? new FormControl(false, Validators.requiredTrue)
        : new FormControl(false);
      this.formArray.push(control);
    });

    this.formArray.push(new FormControl(false, Validators.requiredTrue));
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  hasUncheckedRequiredTerms(): boolean {
    return this.termsAndConditions.some((term, index) =>
      term.isRequired === 1 && !this.formArray.at(index).value
    );
  }

  onSubmit(): void{
    if (this.form.invalid || this.hasUncheckedRequiredTerms()) {
      alert('Please check all required boxes!');
      return;
    }

    const result = this.termsAndConditions.map((item, index) => ({
      ...item,
      checked: this.termsFormArray.at(index).value
    }));

    console.log('Form submitted:', result);

    const payload = this.buildApplicationPayload();

    this.policyService.createPolicyApplication(payload).subscribe({
      next: (response: any): void => {
        // todo BE structure not meet HttpResponseBody requirement
        this.quotationId = response?.id;
        this.premiumMode = response?.planResponseDto?.premiumMode;
        this.duration = this.modeToDurationMap[this.premiumMode];
        this.openModal();
      },
      error: (error): void => {
        console.error('❌ API call failed:', error);
      }
    });
  }

  buildApplicationPayload() {
    const personalDetails = this.store.selectSnapshot(PolicyPurchaseState.getPersonalDetails);
    const plan = this.store.selectSnapshot(PolicyPurchaseState.selectedPlan);
    const referenceNumber = this.store.selectSnapshot(PolicyPurchaseState.getReferenceNumber);
    const user = this.store.selectSnapshot(UserState.getUser);

    return {
      personDto: {
        userId: user.userId,
        ...personalDetails,
        identificationNo: personalDetails?.idNo,
        dateOfBirth: this.convertToIsoDate(personalDetails?.dateOfBirth),
        phoneNo: personalDetails?.mobileNo,
        cigarettesNo: personalDetails?.cigarettesPerDay,
        purposeOfTransaction: personalDetails?.transactionPurpose,
      },
      planInfoDto: {
        ...plan,
        referenceNumber,
      },
    };
  }

  convertToIsoDate(dateStr?: string): string | null {
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split('/');
    const isoDate = new Date(`${year}-${month}-${day}T00:00:00Z`);

    return isNaN(isoDate.getTime()) ? null : isoDate.toISOString();
  }

  openModal(): void{
    this.modalRef = this.dialogService.open(this.paymentDialog, {
      showCloseIcon: true
    });

    this.modalRef.afterClosed().subscribe((result: MyDialogResult) => {
      this.actionResult = result;
      this.processPayment(result);
      this.handlePayment(result);
    });
  }

  processPayment(result: MyDialogResult): void {
    const selectedPlan = this.store.selectSnapshot(PolicyPurchaseState.selectedPlan);

    const payload = {
      quotationId: this.quotationId,
      paymentAmount: selectedPlan?.premiumAmount,
      duration: this.duration,
      paymentStatus: result.toUpperCase(),
      planInfo: selectedPlan,
    };

    this.policyService.initiatePayment(payload).subscribe({
      next: (response: HttpResponseBody) => {
        console.log('💰 Payment initiated:', response);
      },
      error: (error) => console.error('❌ Payment failed:', error),
    });
  }

  handlePayment(result: 'success' | 'fail') {
    this.paymentStatus = result === 'success' ? 1 : 0;
    this.paymentResult.emit(this.paymentStatus);
    this.nextSubStep();
  }

  closeDialog(result: MyDialogResult): void {
    this.modalRef.close(result);
}

  onBack(): void {
    this.prevSubStep();
  }

  ngOnInit(): void {
    this.loadTermsAndConditions();
    this.preparePersonalInfo();
  }
}
