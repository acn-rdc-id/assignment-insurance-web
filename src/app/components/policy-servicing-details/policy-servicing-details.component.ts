import {Component, inject, OnInit} from '@angular/core';
import {NxColComponent, NxLayoutComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import {NxBreadcrumbComponent, NxBreadcrumbItemComponent} from '@aposin/ng-aquila/breadcrumb';
import {RouterLink} from '@angular/router';
import {NxBadgeComponent} from '@aposin/ng-aquila/badge';
import {NxTabComponent, NxTabGroupComponent} from '@aposin/ng-aquila/tabs';
import {PolicyDetails} from '../../models/policy.model';
import {PolicyProductState} from '../../store/policy-product/policy-product.state';
import {Store} from '@ngxs/store';
import {
  NxAccordionDirective,
  NxExpansionPanelComponent,
  NxExpansionPanelHeaderComponent,
  NxExpansionPanelTitleDirective
} from '@aposin/ng-aquila/accordion';
import {NxHeadlineComponent} from '@aposin/ng-aquila/headline';
import {NxCopytextComponent} from '@aposin/ng-aquila/copytext';

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
    NxCopytextComponent
  ],
  templateUrl: './policy-servicing-details.component.html',
  styleUrl: './policy-servicing-details.component.scss'
})
export class PolicyServicingDetailsComponent implements OnInit {
  currentIndex = 0;

  breadcrumbs = [
    { label: 'Policies', link: '/policies' },
    { label: 'ACCENTURE TECHNOLOGY SOLUTIONS SDN. BHD.', link: '#' }
  ];

  policyDetails = {
    companyName: 'Accenture Technology Solutions Sdn. Bhd.',
    subCompany: 'Accenture Solutions Sdn. Bhd.',
    status: 'In Force'
  };

  firstRow = [
    { label: 'Policy no.', value: 'G122222-000' },
    { label: 'Effective date', value: '01 Sep 2024' },
    { label: 'Expiry Date', value: '31 Aug 2025' },
    { label: 'NRIC', value: '900000-10-1001' }
  ];

  secondRow = [
    { label: 'Insured name', value: 'CAPITAL NAME' },
    { label: 'Facility', value: 'Managed Care Free' },
    { label: 'Dependents', value: '2' }
  ];

  cardFields = [
    { label: 'Corporate/Subsidiary Name', value: 'ACCENTURE TECHNOLOGY SOLUTIONS SDN. BHD.' },
    { label: 'Employee Name', value: 'JOHN DOE' },
    { label: 'Insured Name', value: 'JOHN DOE' },
    { label: 'Insured NRIC', value: '900516-10-1000' }
  ];

  store: Store = inject(Store);

  scrollIntoViewActive = true;

  scrollIntoViewOptions: ScrollIntoViewOptions = {
    behavior: 'smooth',
  };

  ngOnInit(): void {
    const policyDetails: PolicyDetails[] = this.store.selectSnapshot(PolicyProductState.getPolicyDetailsList);
    console.log(policyDetails);
  }
}
