import { CommonModule } from '@angular/common';
import {Component, inject, Input, numberAttribute, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NxButtonComponent, NxIconButtonComponent } from '@aposin/ng-aquila/button';
import { NxCardComponent, NxCardHeaderComponent } from '@aposin/ng-aquila/card';
import { NxCopytextComponent } from '@aposin/ng-aquila/copytext';
import { NxColComponent, NxLayoutComponent, NxRowComponent } from '@aposin/ng-aquila/grid';
import { NxHeadlineComponent } from '@aposin/ng-aquila/headline';
import { NxIconComponent } from '@aposin/ng-aquila/icon';
import {NxLinkComponent} from '@aposin/ng-aquila/link';
import { QuotationSummaryComponent } from '../quotation-summary/quotation-summary.component';

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
    // NxIconButtonComponent,
    NxIconComponent, NxLinkComponent, QuotationSummaryComponent
  ],
  templateUrl: './policy-purchase-receipt.component.html',
  styleUrl: './policy-purchase-receipt.component.scss'
})
export class PolicyPurchaseReceiptComponent implements OnInit{
  constructor(private route: ActivatedRoute) {}
  displayPaymentStatus: any;
  private router = inject(Router);

  @Input() paymentStatus: number | null = null;

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
