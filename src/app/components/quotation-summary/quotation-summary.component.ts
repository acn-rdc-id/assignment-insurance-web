import {CommonModule} from '@angular/common';
import {Component, inject, Input, OnChanges, OnInit} from '@angular/core';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {Store} from '@ngxs/store';
import {NxTableCellComponent, NxTableComponent, NxTableRowComponent} from '@aposin/ng-aquila/table';
import {PolicyDetails} from '../../models/policy.model';
import {formatCamelCase, formatPremium} from '../../utils/string-utils';

@Component({
  selector: 'app-quotation-summary',
  imports: [CommonModule, NxTableComponent, NxTableComponent, NxTableRowComponent, NxTableCellComponent],
  templateUrl: './quotation-summary.component.html',
  styleUrl: './quotation-summary.component.scss'
})

export class QuotationSummaryComponent implements OnInit, OnChanges {
  @Input() quotation: PolicyDetails | null = null;
  @Input() paymentMode: string = '';

  store: Store = inject(Store);
  quotationSummary: Array<{ title: string; desc: string }> = [];

  ngOnInit(): void {
    if (!this.quotation) {
      this.quotation = this.store.selectSnapshot(PolicyPurchaseState.getQuotationDetails);
      this.ngOnChanges();
    }
  }

  ngOnChanges(): void {
    // const quotation: PolicyDetails = this.store.selectSnapshot(PolicyPurchaseState.getQuotationDetails);

    // if (!quotation) return;
    // const mode:string = quotation.plan?.premiumMode ?? '';
    if (!this.quotation) return;

    const mode = this.quotation.plan?.premiumMode ?? this.paymentMode;

    this.quotationSummary = [
      {title: 'Plan Information Summary', desc: ''},
      {title: 'Reference Number', desc: this.quotation.quotationNumber ?? '—'},
      {title: 'Gender', desc: this.quotation.personalDetails?.gender ?? '—'},
      {title: 'Date of Birth', desc: this.quotation.personalDetails?.dateOfBirth ?? '—'},
      {title: 'Age Nearest Birthday', desc: this.quotation.personalDetails?.age?.toString() ?? '—'},
      {title: 'Selected Plan', desc: this.quotation.plan?.planName ?? '—'}, //
      {title: 'Premium Mode', desc: formatCamelCase(mode) ?? '—'},
      {title: 'Coverage Term', desc: this.quotation.plan?.coverageTerm ?? '—'}, //
      {title: 'Premium Payable', desc: formatPremium(this.quotation.plan?.premiumAmount, mode)}, //
    ];
  }
}
