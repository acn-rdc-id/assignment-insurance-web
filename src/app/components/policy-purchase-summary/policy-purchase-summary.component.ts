import {Component, OnInit, ViewChild, TemplateRef, Input} from '@angular/core';
import { NxCardComponent } from '@aposin/ng-aquila/card';
import { NxCopytextComponent } from '@aposin/ng-aquila/copytext';
import { NxHeadlineComponent } from '@aposin/ng-aquila/headline';
import { NxLayoutComponent, NxColComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {
  NxHeaderCellDirective,
  NxTableCellComponent,
  NxTableComponent,
  NxTableRowComponent,
} from '@aposin/ng-aquila/table';
import { PolicySummary, TermsConditions } from '../../models/policy.model';
import { PolicyService } from '../../services/policy.service';
import { Store } from '@ngxs/store';
import { DeepCopyService } from '../../services/deep-copy.service';
import { NxCheckboxComponent } from '@aposin/ng-aquila/checkbox';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NxButtonComponent } from '@aposin/ng-aquila/button';
import { NxIconComponent } from '@aposin/ng-aquila/icon';
import { NxDialogService, NxModalCloseDirective } from '@aposin/ng-aquila/modal';
import { Router } from '@angular/router';
import { GetTermsAndConditions } from '../../store/policy/policy-purchase.action';
import { PolicyPurchaseState } from '../../store/policy/policy-purchase.state';

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
    NxModalCloseDirective
  ],
  templateUrl: './policy-purchase-summary.component.html',
  styleUrl: './policy-purchase-summary.component.scss'
})


export class PolicyPurchaseSummaryComponent implements OnInit {
  @ViewChild('paymentDialog') paymentDialog!: TemplateRef<any>;
  modalRef: any;
  form: FormGroup;
  actionResult?: MyDialogResult;
  termsAndConditions:Array<TermsConditions> =[];
  personalInfo: Array<PolicySummary> = [];
  displayPersonalInfo: any[] = [];
  formArray: FormArray;

  @Input() prevSubStep!: () => void;

  constructor(
    private sanitizer: DomSanitizer,
    private policyService: PolicyService,
    private store: Store,
    private fb:FormBuilder,
    private dialogService: NxDialogService,
    private router: Router
    // private deepCopy: DeepCopyService
  ) {

    //stores checked terms
    this.form = this.fb.group({
      terms: this.fb.array([]),
    });
    this.formArray = this.form.get('terms') as FormArray;

   }


  tableElements: Array<PolicySummary> = [{
    name: 'Nur Aina Insyirah',
    nric: '930715-14-5782',
    dob: '15th July 2025',
    gender: 'Female',
    nationality: 'Malaysian',
    birthCountry: 'Malaysia',
    usPerson: 'No',
    mobileNum: '019-6913392',
    email: 'nur.a.binti.hasrin@accenture.com',
    smoker: 'No',
    occupation: 'Programmer',
    purpose: 'I have no purpose in life ahaha',
  }];

  getDisplayName(key: string): string {
    let displayName: string;

    switch (key) {
      case 'name':
        displayName = 'Full Name';
        break;
      case 'nric':
        displayName = 'NRIC';
        break;
      case 'dob':
        displayName = 'Date of Birth';
        break;
      case 'gender':
        displayName = 'Gender';
        break;
      case 'nationality':
        displayName = 'Nationality';
        break;
      case 'birthCountry':
        displayName = 'Birth Country';
        break;
      case 'usPerson':
        displayName = 'US Person';
        break;
      case 'mobileNum':
        displayName = 'Mobile Number';
        break;
      case 'email':
        displayName = 'Email';
        break;
      case 'smoker':
        displayName = 'Smoker';
        break;
      case 'occupation':
        displayName = 'Occupation';
        break;
      case 'purpose':
        displayName = 'Purpose';
        break;
      default:
        displayName = key;
        break;
    }

    return displayName;
  }

  transformPersonalInfo() {
    const summary = this.tableElements[0];
    this.displayPersonalInfo = Object.keys(summary).map(key => ({
      label: this.getDisplayName(key),
      content: summary[key as keyof typeof summary]
    }));

    console.log('Modified Array:', this.displayPersonalInfo);
  }

  getFormControlAt(index: number): FormControl {
    return this.termsFormArray.at(index) as FormControl;
  }

  get termsFormArray(): FormArray {
    return this.form.get('terms') as FormArray;
  }

  //Get Tnc in db
  getTermsandConditions(){

    const tncExist = this.store.selectSnapshot(PolicyPurchaseState.getTermsAndConditions);

    if(!tncExist || tncExist.length === 0){
      this.store.dispatch(new GetTermsAndConditions()).subscribe(()=>{
        this.termsAndConditions=this.store.selectSnapshot(PolicyPurchaseState.getTermsAndConditions);
      })
    }else{
      this.termsAndConditions = tncExist;
    }

    this.formArray.clear();

    this.termsAndConditions.forEach(term => {
      const control = term.isRequired === 1
        ? new FormControl(false, Validators.requiredTrue)
        : new FormControl(false);
      this.formArray.push(control);
    });

    this.formArray.push(new FormControl(false, Validators.requiredTrue));

  }

  sanitizeHtml(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
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

    //Send Personal Information to Backend
    // const payload = this.personalInfo
    // this.policyService.purchasePlan(payload).subscribe({
    //   next: (res) => {
    //     this.termsAndConditions = res.data;
    //     // console.log(this.responseData.length);
    //return payment ref number
    //   },
    //   error: (e) => {
    //     console.error(e);
    //     console.log('error');
    //   }
    // })

    this.OpenModal();

  }

  OpenModal(): void{
    this.modalRef = this.dialogService.open(this.paymentDialog, {
      showCloseIcon: true
    });

    this.modalRef.afterClosed().subscribe((result: MyDialogResult) => {
      this.actionResult = result;

      if (result === 'success') {
        //submit quotation number
        //status = boolean
        this.router.navigate(['/policy-purchase-receipt'], {
          queryParams: { paymentStatus: 1 }
        });
      } else if (result === 'fail') {
        this.router.navigate(['/policy-purchase-receipt'], {
          queryParams: { paymentStatus: 0 }
        });
      }
      else{
        console.log("Unknown result")
      }
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
