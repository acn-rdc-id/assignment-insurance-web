import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PolicyPurchaseState } from '../../store/policy/policy-purchase.state';
import { Store } from '@ngxs/store';
import { PolicyDetails } from '../../models/policy.model';
import { NxTableCellComponent, NxTableComponent } from '@aposin/ng-aquila/table';
import { NxColComponent } from '@aposin/ng-aquila/grid';

@Component({
  selector: 'app-quotation-summary',
  imports: [CommonModule,NxTableComponent,NxTableCellComponent,NxColComponent,NxTableComponent],
  templateUrl: './quotation-summary.component.html',
  styleUrl: './quotation-summary.component.scss'
})
export class QuotationSummaryComponent implements OnInit {
  quotationSummary : any[] = []
  title : Array<String> = ['Plan Information Summary','Reference Number','Gender','Date of Birth','Age Nearest Birthday','Selected Plan','Premium Mode','Coverage Term','Premium Payable'];
  desc : any[] = []
  constructor(private store: Store){

  }
  ngOnInit(): void {
    const quotationDetails = this.store.selectSnapshot(PolicyPurchaseState.getQuotationDetails);
   console.log(quotationDetails)
   this.desc = [
    '',
    quotationDetails.quotationNumber,
    quotationDetails.personalDetails?.gender,
    quotationDetails.personalDetails?.dateOfBirth,
    quotationDetails.personalDetails?.age,
    quotationDetails.plan?.planName,
    quotationDetails.plan?.paymentPeriod,
    quotationDetails.plan?.coverageTerm,
    "RM " + quotationDetails.plan?.premiumAmount + "/" + quotationDetails.plan?.paymentPeriod
   ]

   for (let index = 0; index < this.desc.length; index++) {
    this.quotationSummary.push({title:this.title[index],desc:this.desc[index]})
    
   }

   console.log(this.quotationSummary)
  }


  
  
  
}
