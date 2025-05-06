import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NxButtonComponent, NxIconButtonComponent } from '@aposin/ng-aquila/button';
import { NxCardComponent, NxCardHeaderComponent } from '@aposin/ng-aquila/card';
import { NxCopytextComponent } from '@aposin/ng-aquila/copytext';
import { NxColComponent, NxLayoutComponent, NxRowComponent } from '@aposin/ng-aquila/grid';
import { NxHeadlineComponent } from '@aposin/ng-aquila/headline';
import { NxIconComponent } from '@aposin/ng-aquila/icon';

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
    NxIconComponent
  ],
  templateUrl: './policy-purchase-receipt.component.html',
  styleUrl: './policy-purchase-receipt.component.scss'
})
export class PolicyPurchaseReceiptComponent implements OnInit{
  constructor(private route: ActivatedRoute) {}
  displayPaymentStatus: any;
  paymentStatus: any;

  getStatusColor(status: string): { [key: string]: string } {
    switch (status) {
      case '1':
        return { color: 'green', 'font-weight': 'bold' };
      case '0':
        return { color: 'red', 'font-weight': 'bold' };
      default:
        return { color: 'orange', 'font-weight': 'bold' };
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.paymentStatus = params['paymentStatus'];
      console.log('Payment Status:', this.paymentStatus);

      switch(this.paymentStatus){
        case '0':
          this.displayPaymentStatus = 'Failure';
          break;
        case '1':
          this.displayPaymentStatus = "Successful";
          break;
        default:
          this.displayPaymentStatus = 'Invalid';
          break;
      }
    });
  }

}
