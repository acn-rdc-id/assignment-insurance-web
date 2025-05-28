import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import {NxButtonComponent} from '@aposin/ng-aquila/button';
import {NxColComponent, NxLayoutComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import {NxIconComponent} from '@aposin/ng-aquila/icon';
import {NxTableComponent, NxTableRowComponent} from '@aposin/ng-aquila/table';
import {QuotationSummaryComponent} from '../quotation-summary/quotation-summary.component';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {Store} from '@ngxs/store';
import { PaymentAction } from '../../enums/payment-action.enum';
import { PaymentDetails, PolicyDetails } from '../../models/policy.model';

@Component({
  selector: 'app-policy-purchase-receipt',
  imports: [NxLayoutComponent,
    NxRowComponent,
    NxColComponent,
    CommonModule,
    NxButtonComponent,
    NxIconComponent, NxTableComponent, NxTableRowComponent, QuotationSummaryComponent
  ],
  templateUrl: './policy-purchase-receipt.component.html',
  styleUrl: './policy-purchase-receipt.component.scss'
})
export class PolicyPurchaseReceiptComponent implements OnInit{
  displayPaymentStatus: string = '';
  quotationDetails!: PolicyDetails;
  paymentDetails!: PaymentDetails;
  paymentAction: typeof PaymentAction = PaymentAction;

  private router: Router = inject(Router);
  private store: Store = inject(Store);

  getStatusColor(status: string) {
    switch (status) {
      case PaymentAction.Success:
        return { color: 'green', 'font-weight': 'bold' };
      case PaymentAction.Failed:
        return { color: 'red', 'font-weight': 'bold' };
      default:
        return { color: 'orange', 'font-weight': 'bold' };
    }
  }

  ngOnInit(): void {
    this.quotationDetails = this.store.selectSnapshot(PolicyPurchaseState.getQuotationDetails);
    this.paymentDetails = this.store.selectSnapshot(PolicyPurchaseState.getPaymentDetails);
    switch (this.paymentDetails.status) {
      case PaymentAction.Success:
        this.displayPaymentStatus = 'Successful';
        break;
      case PaymentAction.Failed:
        this.displayPaymentStatus = 'Failure';
        break;
      default:
        this.displayPaymentStatus = 'Invalid';
        break;
    }

    console.log('Payment Status:', this.paymentDetails.status);
  }

  onNext(): void {
    const policyDetails: PolicyDetails = this.store.selectSnapshot(PolicyPurchaseState.getQuotationDetails);
    this.router.navigate(['/policy-servicing-details', policyDetails.policyId]);
  }
}
