import {Component, inject, OnInit} from '@angular/core';
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
import {NxFormfieldAppendixDirective} from '@aposin/ng-aquila/formfield';
import {NxIconButtonComponent} from '@aposin/ng-aquila/button';
import {NxIconComponent} from '@aposin/ng-aquila/icon';
import {NxPopoverComponent, NxPopoverTriggerDirective} from '@aposin/ng-aquila/popover';
import {Store} from '@ngxs/store';
import {PolicyProductState} from '../../store/policy-product/policy-product.state';
import {formatDate} from '../../utils/date-utils';

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
    NxIconButtonComponent,
    NxIconComponent,
    NxPopoverComponent,
    NxPopoverTriggerDirective
  ],
  templateUrl: './policy-servicing-details.component.html',
  styleUrl: './policy-servicing-details.component.scss'
})

export class PolicyServicingDetailsComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: Store = inject(Store);

  policyDetail: any;
  policyBeneficiaries: any;
  currentIndex: number = 0;
  currentPolicyNo: string | null = '';

  breadcrumbs: Breadcrumb[] = [];

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

    this.cardFields = [
      { label: 'Corporate/Subsidiary Name', value: personalDetails?.fullName ?? '-' },
      { label: 'Employee Name', value: personalDetails?.fullName ?? '-' },
      { label: 'Insured Name', value: personalDetails?.fullName ?? '-' },
      { label: 'Insured NRIC', value: personalDetails?.idNo ?? '-' }
    ];
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
    this.route.paramMap.subscribe(params => {
      this.currentPolicyNo = params.get('policyNo');
      this.loadSelectedPolicy();
    });
  }
}
