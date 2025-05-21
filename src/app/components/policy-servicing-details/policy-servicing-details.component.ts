import {Component, inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import {NxColComponent, NxLayoutComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import {NxBreadcrumbComponent, NxBreadcrumbItemComponent} from '@aposin/ng-aquila/breadcrumb';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NxBadgeComponent} from '@aposin/ng-aquila/badge';
import {NxTabComponent, NxTabGroupComponent} from '@aposin/ng-aquila/tabs';
import {
  NxAccordionDirective,
  NxExpansionPanelComponent,
  NxExpansionPanelHeaderComponent,
  NxExpansionPanelTitleDirective
} from '@aposin/ng-aquila/accordion';
import {NxHeadlineComponent} from '@aposin/ng-aquila/headline';
import {NxCopytextComponent} from '@aposin/ng-aquila/copytext';
import {
  PolicyServicingBeneficiaryComponent
} from '../policy-servicing-beneficiary/policy-servicing-beneficiary.component';
import {NxFormfieldModule, NxFormfieldAppendixDirective} from '@aposin/ng-aquila/formfield';
import {NxDropdownComponent, NxDropdownItemComponent} from '@aposin/ng-aquila/dropdown';
import {NxIconButtonComponent} from '@aposin/ng-aquila/button';
import {NxIconComponent} from '@aposin/ng-aquila/icon';
import {NxPopoverComponent, NxPopoverTriggerDirective} from '@aposin/ng-aquila/popover';
import {Store} from '@ngxs/store';
import {PolicyProductState} from '../../store/policy-product/policy-product.state';
import {formatDate} from '../../utils/date-utils';
import { UpdateInsuredInfo } from '../../store/policy-product/policy-product.action';
// import { formatDate } from '@angular/common';

export interface Breadcrumb {
  label: string;
  link: string | null;
}

@Component({
  selector: 'app-policy-servicing-details',
  imports: [
    NxLayoutComponent,
    NxBreadcrumbComponent,
    NxBreadcrumbItemComponent,
    RouterLink,
    NxRowComponent,
    NxColComponent,
    NxBadgeComponent,
    NxTabGroupComponent,
    NxTabComponent,
    NxAccordionDirective,
    NxExpansionPanelComponent,
    NxExpansionPanelHeaderComponent,
    NxExpansionPanelTitleDirective,
    NxHeadlineComponent,
    NxCopytextComponent,
    PolicyServicingBeneficiaryComponent,
    NxFormfieldAppendixDirective,
    NxFormfieldModule,
    NxInputModule,
    NxDropdownComponent,
    NxDropdownItemComponent,
    NxButtonModule,
    NxIconButtonComponent,
    NxIconComponent,
    NxPopoverComponent,
    NxPopoverTriggerDirective,
    ReactiveFormsModule
  ],
  templateUrl: './policy-servicing-details.component.html',
  styleUrl: './policy-servicing-details.component.scss'
})

export class PolicyServicingDetailsComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: Store = inject(Store);

  insuredForm!: FormGroup;

  FIELD_OPTIONS = {
    title: [
      { value: 'Mr', label: 'Mr' },
      { value: 'Mrs', label: 'Mrs' },
    ],
    countryCode: [
      { value: '60', label: '60'},
      { value: '62', label: '62'}
    ]
  }

  editMode: boolean = false;
  initialFormValue: any;


  policyDetail: any;
  policyBeneficiaries: any;
  currentIndex: number = 0;
  currentPolicyNo: string | null = '';

  breadcrumbs: Breadcrumb[] = [];

  constructor(private fb: FormBuilder) {}

  policyDetails = {
    companyName: 'Accenture Technology Solutions Sdn. Bhd.',
    subCompany: 'Accenture Solutions Sdn. Bhd.',
    status: 'In Force'
  };

  firstRow = [{
    label: '', value: ''
  }];

  secondRow = [
    { label: '', value: '' },
  ];

  cardFields = [
    { label: 'Corporate/Subsidiary Name', value: 'ACCENTURE TECHNOLOGY SOLUTIONS SDN. BHD.' },
    { label: 'Employee Name', value: 'JOHN DOE' },
    { label: 'Insured Name', value: 'JOHN DOE' },
    { label: 'Insured NRIC', value: '900516-10-1000' }
  ];

  scrollIntoViewActive: boolean = true;
  scrollIntoViewOptions: ScrollIntoViewOptions = {
    behavior: 'smooth',
  };

  private setupBreadcrumbs(): void {
    this.breadcrumbs = [
      { label: 'Policies', link: '/policy-product' },
      { label: 'Policy Servicing', link: '/policy-servicing' },
      { label: 'Policy Details', link: '#' }
    ];
  }

  private populatePolicyRows(): void {
    const { plan, personalDetails, quotationNumber } = this.policyDetail;

    this.firstRow = [
      { label: 'Policy no.', value: quotationNumber ?? '-' },
      { label: 'Effective date', value: formatDate(plan?.startDate) },
      { label: 'Expiry Date', value: formatDate(plan?.endDate) },
      { label: 'NRIC', value: personalDetails?.identificationNo ?? '-' }
    ];

    this.secondRow = [
      { label: 'Insured name', value: personalDetails?.fullName ?? '-' },
      { label: 'Beneficiary', value:  this.policyBeneficiaries.beneficiaryList.length ?? 0 },
    ];

    // this.cardFields = [
    //   { label: 'Title', value: personalDetails?.title ?? '-' },
    //   { label: 'Full Name', value: personalDetails?.fullName ?? '-' },
    //   { label: 'Country Code', value: personalDetails?.countryCode ?? '-' },
    //   { label: 'Mobile Number', value: personalDetails?.phoneNo ?? '-' },
    //   { label: 'Email', value: personalDetails?.email ?? '-'}
    // ];

    this.insuredForm.patchValue({
      title: personalDetails?.title ?? '',
      fullName: personalDetails?.fullName ?? '',
      countryCode: personalDetails?.countryCode ?? '',
      phoneNo: personalDetails?.phoneNo ?? '',
      email: personalDetails?.email ?? '',
      identificationNo: personalDetails?.identificationNo ?? '',
      gender: personalDetails?.gender ?? '',
      dob: formatDate(personalDetails?.dateOfBirth) ?? '',
      countryOfBirth: personalDetails?.countryOfBirth,
      nationality: personalDetails?.nationality,
      // occupation: personalDetails?.occupation,
      // purposeOfTransaction: personalDetails?.purposeOfTransaction
    });

    this.insuredForm.disable();
  }

onSaveInsuredInfo(): void {
  if (this.insuredForm.invalid) {
    this.insuredForm.markAllAsTouched();
    return;
  }
    const updatedInfo = this.insuredForm.value;
    
    this.store.dispatch(new UpdateInsuredInfo(this.currentPolicyNo!, updatedInfo)).subscribe(() => {
      this.editMode = false;
      this.loadSelectedPolicy();
    })
}

openEdit() {
  this.editMode = true;
  this.initialFormValue = this.insuredForm.getRawValue();
  // this.insuredForm.enable();
  this.insuredForm.get('title')?.enable();
  this.insuredForm.get('fullName')?.enable();
  this.insuredForm.get('countryCode')?.enable();
  this.insuredForm.get('phoneNo')?.enable();
  this.insuredForm.get('email')?.enable();
}

onCancelEdit(): void {
  this.insuredForm.patchValue(this.initialFormValue);
  this.insuredForm.markAsPristine();
  this.editMode = false;
  this.insuredForm.disable();
}


  loadSelectedPolicy(): void {
    if (!this.currentPolicyNo) return;

    const policyDetailsList = this.store.selectSnapshot(PolicyProductState.getPolicyDetailsList);
    const policyBeneficiaryList = this.store.selectSnapshot(PolicyProductState.getPolicyBeneficiaries);

    const policyDetail = policyDetailsList.find(
      (entry: { quotationNumber: string }) =>
        entry.quotationNumber?.trim() === this.currentPolicyNo!.trim()
    );

    const policyBeneficiaries = policyBeneficiaryList.find(
      (entry: { policyNo: string }) =>
        entry.policyNo?.trim() === this.currentPolicyNo!.trim()
    );

    if (!policyDetail) return;

    this.policyDetail = policyDetail;
    this.policyBeneficiaries = policyBeneficiaries;

    console.log(this.policyDetail);
    this.setupBreadcrumbs();
    this.populatePolicyRows();
  }


  ngOnInit(): void {

    this.insuredForm = this.fb.group({
      title: ['', Validators.required],
      fullName: ['', Validators.required],
      countryCode: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern(/^\d{8,10}$/)]], 
      email: ['', [Validators.required, Validators.email]],

      identificationNo: [{ value: '', disabled: true }],
      gender: [{ value: '', disabled: true }],
      dob: [{ value: '', disabled: true }],

      countryOfBirth: [{ value: '', disable: true}],
      nationality: [{ value: '', disable: true}],
      // occupation: [{ value: '', disable: true}],
      // purposeOfTransaction: [{ value: '', disable: true}]
    })

    this.insuredForm.disable();

    this.route.paramMap.subscribe(params => {
      this.currentPolicyNo = params.get('policyNo');
      this.loadSelectedPolicy();
    });
  }
}
