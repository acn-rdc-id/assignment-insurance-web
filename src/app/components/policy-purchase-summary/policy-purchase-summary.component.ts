import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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

type MyDialogResult = 'success' | 'fail';

@Component({
  selector: 'app-policy-purchase-summary',
  imports: [
    NxCardComponent,
    NxHeadlineComponent,
    NxCopytextComponent,
    NxLayoutComponent,
    NxColComponent,
    NxRowComponent,NxHeaderCellDirective,
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
      terms: this.fb.array([])
    });

    //To get Personal Info from the State
    // this.store.dispatch(new setAddresslist()).subscribe(()=>{
    //   this.personalInfo= this.deepCopy.deepCopy(this.store.selectSnapshot(HomeState.getAddressList));
    // })

   }
   termsAndConditions:Array<TermsConditions> =[];
   personalInfo: Array<PolicySummary> = [];
  //  termsForm!: new FormGroup;
  //  this.termsForm = this.fb.group({
  //   firstName: [''],
  //   lastName: ['']
  // });
  

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

  tableElements1 = [{
    terms_id: 1,
    terms_html: `<p>Are you aware that this product pays out benefits:</p>
  <p>&emsp;(i)  Upon Death. / Selepas Kematian.</p>
  <p>&emsp;(ii) Upon Total and Permanent Disability (TPD). / Selepas Hilang Upaya Menyeluruh dan Kekal (TPD).</p>`
  },
  {
    terms_id: 2,
    terms_html: `<p>Are you aware that this product does not pay out benefits:</p>
  <p>&emsp;(i) In the event of death caused by suicide within 1 year from policy issue date.</p>
  <p>&emsp;(ii) In the event of TPD caused by attempting suicide or self-inflicted bodily injuries while sane or insane.</p>
  <p>&emsp;(iii) In the event of TPD caused by Pre-existing Conditions.</p>`
  },
  {
    terms_id: 2,
    terms_html: `<p>Are you aware that:</p>
  <p>&emsp;(i) If you change your mind, you have 15 days to return the policy from the date you receive the policy and you can obtain a refund.</p>
  <p>&emsp;(ii) You can nominate your beneficiaries in the policy servicing (you may wish to inform them about the policy to make payment of future claims easier)</p>`
  },
];

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

  displayPersonalInfo: any[] = []; 

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
    // this.policyService.getTermsConditions().subscribe({
    //   next: (res) => {
    //     this.termsAndConditions = res.data;
    //     // console.log(this.responseData.length);
    //   },
    //   error: (e) => {
    //     console.error(e);
    //     console.log('error');
    //   }
    // })

    this.termsAndConditions = this.tableElements1
    const formArray = this.form.get('terms') as FormArray;
    formArray.clear();

    this.termsAndConditions.forEach(() => formArray.push(new FormControl(false, Validators.requiredTrue)));
    console.log("formArray==> ", formArray)

    formArray.push(new FormControl(false, Validators.requiredTrue));
  
  }

  ngOnInit(): void {
    // this.form = this.fb.group({
    //   terms: this.fb.array([])
    // });

    this.getTermsandConditions();
    this.transformPersonalInfo();
  }

  sanitizeHtml(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  onSubmit(){
    if (this.form.invalid || this.termsFormArray.controls.some(term => !term.value)) {
      alert('Please check all boxes before submitting.');
      return;
    }

    const result = this.tableElements1.map((item, index) => ({
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
    });
  
  }

  closeDialog(result: MyDialogResult): void {
    this.modalRef.close(result);
}

  onBack(){
    console.log("this redirects to previous page")
  }

}
