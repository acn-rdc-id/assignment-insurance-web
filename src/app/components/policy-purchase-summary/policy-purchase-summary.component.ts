import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NxColComponent, NxLayoutComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import {CommonModule} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {NxTableCellComponent, NxTableComponent, NxTableRowComponent,} from '@aposin/ng-aquila/table';
import {Store} from '@ngxs/store';
import {NxCheckboxComponent} from '@aposin/ng-aquila/checkbox';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NxButtonComponent} from '@aposin/ng-aquila/button';
import {NxIconComponent} from '@aposin/ng-aquila/icon';
import {NxDialogService, NxModalCloseDirective, NxModalRef} from '@aposin/ng-aquila/modal';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {SUMMARY_FORM_LABELS, SUMMARY_FORM_ORDERS} from '../../constants/form.costants';
import {HttpErrorBody} from '../../models/http-body.model';
import {UserState} from '../../store/user/user.state';
import {QuotationSummaryComponent} from '../quotation-summary/quotation-summary.component';
import {NxErrorComponent} from '@aposin/ng-aquila/base';
import {MessageModalData} from '../../models/message-modal-data.model';
import {PostPayment, PostPolicyApplication} from '../../store/policy/policy-purchase.action';
import {MessageModalComponent} from '../message-modal/message-modal.component';
import {Subject} from 'rxjs';
import {convertToIsoDate} from '../../utils/date-utils';
import {PolicyService} from '../../services/policy.service';
import {User} from '../../models/user.model';
import {PolicyPlan} from '../../models/policy.model';

type MyDialogResult = 'success' | 'failed';

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
    QuotationSummaryComponent,
    NxErrorComponent
  ],
  templateUrl: './policy-purchase-summary.component.html',
  styleUrl: './policy-purchase-summary.component.scss'
})

export class PolicyPurchaseSummaryComponent implements OnInit, OnDestroy {
  policyService: PolicyService = inject(PolicyService);

  quotationId: number = 0;
  premiumMode: string = "";
  duration: number = 0;
  submitted: boolean = false;
  finalConfirmation: FormControl<boolean | null> | undefined;
  termsAndConditions: any[] = [];
  displayPersonalInfo: any[] = [];
  quotationDetails: any = [];
  private unsubscribe$ = new Subject();
  dialogRef?: NxModalRef<any>;

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
    return this.formArray.at(index) as FormControl;
  }

  get termsFormArray(): FormArray {
    return this.form.get('terms') as FormArray;
  }

  loadTermsAndConditions(): void {
    const termsList = this.store.selectSnapshot(PolicyPurchaseState.getTermsAndConditions);
    if (!termsList?.length || !termsList[0].termsHtml) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = termsList[0].termsHtml;

    const ol = wrapper.querySelector('ol');
    if (!ol) {
      console.warn('⚠️ No <ol> found in terms HTML.');
      return;
    }

    const liNodes = ol.querySelectorAll(':scope > li');
    if (!liNodes.length) {
      console.warn('⚠️ No <li> inside <ol>.');
      return;
    }

    this.termsAndConditions = Array.from(liNodes).map((li, index) => {
      const cleanedContent = li.innerHTML
        // .replace(/<\/?(ul|ol)>/gi, '')
        .trim();

      return {
        id: index + 1,
        termsHtml: cleanedContent,
        isRequired: true,
      };
    });

    this.formArray.clear();
    this.termsAndConditions.forEach(term =>
      this.formArray.push(
        new FormControl(false, term.isRequired ? Validators.requiredTrue : [])
      )
    );

    this.formArray.push(new FormControl(false, Validators.requiredTrue));
  }

  sanitizeHtml(html: string): SafeHtml {
    const cleanedHtml = html.replace(/<strong>Yes<\/strong>/gi, '');
    return this.sanitizer.bypassSecurityTrustHtml(cleanedHtml);
  }

  hasUncheckedRequiredTerms(): boolean {
    return this.termsAndConditions.some((term, index) =>
      term.isRequired === 1 && !this.formArray.at(index).value
    );
  }

  onSubmit(): void{
    this.submitted = true;

    if (this.form.invalid || this.hasUncheckedRequiredTerms()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return;
    }

    const result = this.termsAndConditions.map((item, index) => ({
      ...item,
      checked: this.termsFormArray.at(index).value
    }));

    console.log('Form submitted:', result);

    const payload = this.buildApplicationPayload();

    this.policyService.postPolicyApplication(payload).subscribe({
      next: (response: any): void => {
        this.quotationId = response.data.id;
        this.premiumMode = response.data.planResponseDto?.premiumMode;
        this.duration = this.modeToDurationMap[this.premiumMode];
        this.openModal();
      },
      error: (error): void => {
        console.error('❌ API call failed:', error);
      }
    });

    // todo fix this later
    // this.store.dispatch(new PostPolicyApplication(payload)).subscribe({
    //   next: (): void => {
    //     this.quotationDetails = this.store.selectSnapshot(PolicyPurchaseState.getQuotationDetails);
    //     this.openModal();
    //   },
    //   error: (err: HttpErrorBody): void => {
    //     this.openErrorModal({
    //       header: 'Error',
    //       message: err.message ?? 'Unexpected error occurred.'
    //     });
    //   }
    // });
  }

  buildApplicationPayload() {
    const personalDetails = this.store.selectSnapshot(PolicyPurchaseState.getPersonalDetails);
    const plan: PolicyPlan | undefined = this.store.selectSnapshot(PolicyPurchaseState.selectedPlan);
    const referenceNumber: string = this.store.selectSnapshot(PolicyPurchaseState.getReferenceNumber);
    const user: User = this.store.selectSnapshot(UserState.getUser);

    return {
      personDto: {
        userId: user.userId,
        ...personalDetails,
        identificationNo: personalDetails?.idNo,
        dateOfBirth: convertToIsoDate(personalDetails?.dateOfBirth),
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
      quotationId: this.quotationId,//this.quotationDetails.quotationId, todo fix this later
      paymentAmount: selectedPlan?.premiumAmount,
      duration: this.modeToDurationMap[this.quotationDetails.premiumMode],
      paymentStatus: result.toUpperCase(),
      planInfo: selectedPlan,
    };
    this.store.dispatch(new PostPayment(payload));
  }

  handlePayment(result: 'success' | 'failed'): void {
    this.paymentStatus = result === 'success' ? 1 : 0;
    this.paymentResult.emit(this.paymentStatus);
    this.nextSubStep();
  }

  onBack(): void {
    this.prevSubStep();
  }

  private openErrorModal(messageData?: MessageModalData): void {
    this.dialogRef = this.dialogService.open(MessageModalComponent, {
      data: messageData,
      disableClose: true,
      ariaLabel: 'Error dialog'
    })
  }

  ngOnInit(): void {
    this.loadTermsAndConditions();
    this.preparePersonalInfo();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('');
    this.unsubscribe$.complete();
  }
}
