import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {Store} from '@ngxs/store';
import {
  NxHeaderCellDirective,
  NxTableCellComponent,
  NxTableComponent,
  NxTableRowComponent
} from '@aposin/ng-aquila/table';
import {PolicyDetails} from '../../models/policy.model';
import {NxBadgeComponent} from '@aposin/ng-aquila/badge';
import {NxLinkComponent} from '@aposin/ng-aquila/link';

@Component({
  selector: 'app-quotation-summary',
  imports: [CommonModule, NxTableComponent, NxTableComponent, NxTableRowComponent, NxTableCellComponent, NxBadgeComponent, NxLinkComponent, NxHeaderCellDirective],
  templateUrl: './quotation-summary.component.html',
  styleUrl: './quotation-summary.component.scss'
})
export class QuotationSummaryComponent implements OnInit {
  store: Store = inject(Store);
  quotationSummary: Array<{ title: string; desc: string }> = [];

  formatPremium(amount?: number, mode: string = ''): string {
    if (!amount) return '—';
    const normalizedMode = mode.toLowerCase();
    return `RM ${amount} / ${normalizedMode}`;
  }

  formatCamelCase(path: string): string {
    return path
      .split('-')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  ngOnInit(): void {
    const quotation: PolicyDetails = this.store.selectSnapshot(PolicyPurchaseState.getQuotationDetails);

    if (!quotation) return;
    const mode:string = quotation.plan?.premiumMode ?? '';

    this.quotationSummary = [
      {title: 'Plan Information Summary', desc: ''},
      {title: 'Reference Number', desc: quotation.quotationNumber ?? '—'},
      {title: 'Gender', desc: quotation.personalDetails?.gender ?? '—'},
      {title: 'Date of Birth', desc: quotation.personalDetails?.dateOfBirth ?? '—'},
      {title: 'Age Nearest Birthday', desc: quotation.personalDetails?.age?.toString() ?? '—'},
      {title: 'Selected Plan', desc: quotation.plan?.planName ?? '—'},
      {title: 'Premium Mode', desc: this.formatCamelCase(mode) ?? '—'},
      {title: 'Coverage Term', desc: quotation.plan?.coverageTerm ?? '—'},
      {title: 'Premium Payable', desc: this.formatPremium(quotation.plan?.premiumAmount, mode)},
    ];
  }
}
