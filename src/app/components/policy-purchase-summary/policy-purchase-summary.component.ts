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
  @ViewChild('paymentDialog') paymentDialog!: TemplateRef<any>;
  modalRef: any;
  form: FormGroup;
  actionResult?: MyDialogResult;
  termsAndConditions:Array<TermsConditions> = [];
  displayPersonalInfo: any[] = [];
  formArray: FormArray;

  @Input() nextSubStep!: () => void;
  @Input() prevSubStep!: () => void;
  @Output() paymentResult = new EventEmitter<number>();
  paymentStatus: number | null = null;
  finalConfirmation: FormControl<boolean | null> | undefined;

  policyService: PolicyService = inject(PolicyService);

  quotationId: number = 0;
  premiumMode: string = "";
  modeToDurationMap: Record<string, number> = {
    MONTHLY: 1,
    YEARLY: 12,
  };
  duration: number = 0;
  planInfo = "";

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

  handlePayment(result: 'success' | 'fail') {
    this.paymentStatus = result === 'success' ? 1 : 0;
    this.paymentResult.emit(this.paymentStatus);
    this.nextSubStep();
  }

  transformPersonalInfo(): void {
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

  getTermsandConditions(){
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
    const cleanedHtml: string = html.replace(/<strong>Yes<\/strong>/gi, '');
    return this.sanitizer.bypassSecurityTrustHtml(cleanedHtml);
  }

  onSubmit(){

    const checkboxIsRequired = this.termsAndConditions.some((term, index) =>
      term.isRequired === 1 && !this.formArray.at(index).value
    );

    if (this.form.invalid || checkboxIsRequired) {
      alert('Please check all required boxes!');
      return;
    }

    const result = this.termsAndConditions.map((item, index) => ({
      ...item,
      checked: this.termsFormArray.at(index).value
    }));

    console.log('Form submitted:', result);

    const personalDetails = this.store.selectSnapshot(PolicyPurchaseState.getPersonalDetails);
    const planInfoDto = this.store.selectSnapshot(PolicyPurchaseState.selectedPlan);
    const referenceNumber = this.store.selectSnapshot(PolicyPurchaseState.getReferenceNumber);
    const user = this.store.selectSnapshot(UserState.getUser);

    const planInfoWithRef = {
      ...planInfoDto,
      referenceNumber,
    };

    const personDto = {
      userId: user.userId,
      ...personalDetails,
      identificationNo: personalDetails?.idNo,
      dateOfBirth: this.convertToIsoDate(personalDetails?.dateOfBirth),
      phoneNo: personalDetails?.mobileNo,
      cigarettesNo: personalDetails?.cigarettesPerDay,
      purposeOfTransaction: personalDetails?.transactionPurpose,
    };

    const payload = {
      personDto: personDto,
      planInfoDto: planInfoWithRef,
    };

    this.policyService.createApplication(payload).subscribe({
      next: (response: any): void => {
        // todo BE structure not meet HttpResponseBody requirement
        this.quotationId = response?.id;
        this.premiumMode = response?.planResponseDto?.premiumMode;
        this.duration = this.modeToDurationMap[this.premiumMode];
      },
      error: (error): void => {
        console.error('❌ API call failed:', error);
      }
    });

    this.OpenModal();
  }

  convertToIsoDate(dateStr?: string): string | null {
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split('/');
    const isoDate = new Date(`${year}-${month}-${day}T00:00:00Z`);

    return isNaN(isoDate.getTime()) ? null : isoDate.toISOString();
  }

  OpenModal(): void{
    this.modalRef = this.dialogService.open(this.paymentDialog, {
      showCloseIcon: true
    });

    this.modalRef.afterClosed().subscribe((result: MyDialogResult) => {
      this.actionResult = result;
      const selectedPlan = this.store.selectSnapshot(PolicyPurchaseState.selectedPlan);

      const payload = {
        quotationId: this.quotationId,
        paymentAmount: selectedPlan?.premiumAmount,
        duration: this.duration,
        paymentStatus: result.toUpperCase(),
        planInfo: selectedPlan
      }

      this.policyService.createPayment(payload).subscribe({
        next: (response: HttpResponseBody): void => {
          // const isSuccess: boolean = response?.code === 200 && response?.data;
          console.log("Response create application api", response);
        },
        error: (error): void => {
          console.error('❌ API call failed:', error);
        }
      });

      this.handlePayment(result);
    });
  }

  closeDialog(result: MyDialogResult): void {
    this.modalRef.close(result);
}

  onBack(): void {
    this.prevSubStep();
  }

  ngOnInit(): void {
    this.getTermsandConditions();
    this.transformPersonalInfo();
  }

}
