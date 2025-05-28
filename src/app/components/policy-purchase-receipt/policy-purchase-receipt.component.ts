import {CommonModule} from '@angular/common';
import {Component, inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NxButtonComponent} from '@aposin/ng-aquila/button';
import {NxColComponent, NxLayoutComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import {NxIconComponent} from '@aposin/ng-aquila/icon';
import {NxTableComponent, NxTableRowComponent} from '@aposin/ng-aquila/table';
import {QuotationSummaryComponent} from '../quotation-summary/quotation-summary.component';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {Store} from '@ngxs/store';
import { NxCardComponent, NxCardHeaderComponent } from '@aposin/ng-aquila/card';
import { NxCopytextComponent } from '@aposin/ng-aquila/copytext';
import { NxHeadlineComponent } from '@aposin/ng-aquila/headline';

@Component({
  selector: 'app-policy-purchase-receipt',
  imports: [NxCardComponent,
    NxHeadlineComponent,
    NxCopytextComponent,
    NxLayoutComponent,
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
  constructor(private route: ActivatedRoute) {}
  displayPaymentStatus: any;
  private router: Router = inject(Router);
  private store: Store = inject(Store);

  @Input() paymentStatus: number | null = null;
  quotationDetails: any = [];

  getStatusColor(status: number | null) {
    switch (status) {
      case 1:
        return { color: 'green', 'font-weight': 'bold' };
      case 0:
        return { color: 'red', 'font-weight': 'bold' };
      default:
        return { color: 'orange', 'font-weight': 'bold' };
    }
  }

  ngOnInit(): void {
    this.quotationDetails = this.store.selectSnapshot(PolicyPurchaseState.getQuotationDetails);
    switch (this.paymentStatus) {
      case 1:
        this.displayPaymentStatus = 'Successful';
        break;
      case 0:
        this.displayPaymentStatus = 'Failure';
        break;
      default:
        this.displayPaymentStatus = 'Invalid';
        break;
    }

    console.log('Payment Status:', this.paymentStatus);
  }

  onNext(): void {
    this.router.navigate(['/policy-product']);
  }
}
