import { Component, inject, Input, OnInit } from '@angular/core';
import { ClaimService } from '../../services/claim.service';
import { NxSortDirective, NxSortHeaderComponent, NxTableCellComponent, NxTableComponent, SortDirection, SortEvent } from '@aposin/ng-aquila/table';
import { NxColComponent } from '@aposin/ng-aquila/grid';
import { DatePipe, NgClass } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { NxTabComponent, NxTabGroupComponent } from '@aposin/ng-aquila/tabs';
import { NxButtonComponent } from '@aposin/ng-aquila/button';
import { NxBadgeComponent } from '@aposin/ng-aquila/badge';
import { Claims } from '../../models/claim.model';
import { Store } from '@ngxs/store';
import { MessageModalData } from '../../models/message-modal-data.model';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { PolicyPurchaseState } from '../../store/policy/policy-purchase.state';
import { getClaimList } from '../../store/policy-claim/policy-claim.action';
import { PolicyClaimState } from '../../store/policy-claim/policy-claim.state';
import { PolicyClaim } from '../../models/policy-claim.model';


@Component({
  selector: 'app-claim-list',
  imports: [
    NxTableCellComponent,
    NxTableComponent,
    NxColComponent,
    NxSortDirective,
    NxSortHeaderComponent,
    DatePipe, 
    NxTabComponent,
    NxTabGroupComponent,
    NxButtonComponent,
    NxBadgeComponent,
    ],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss'
})
export class ClaimListComponent implements OnInit {
  @Input() claimList: any;
  private dialogService = inject(NxDialogService);
  dialogRef?: NxModalRef<any>;
  

  store: Store = inject(Store);
  ngOnInit(): void {
    this.store.dispatch(new getClaimList).subscribe({
      complete: () => {
        const claimList: Claims = this.store.selectSnapshot(PolicyClaimState.getClaimList);
        this.claimList = claimList;
        console.log(this.store.selectSnapshot(PolicyClaimState.getPolicyClaimList));  
      },
      error: (err) => {
        const messageData: MessageModalData = {
          header: 'Error',
          message: err.message ?? 'Unexpected error occurred.'
        };
        this.openErrorModal(messageData);
      }
    });
    
    // Check if claimList is already populated
  // if(!this.claimList) {
  //   this.claimList = this.store.selectSnapshot(ClaimListState.getClaimList)
  //   };
  //   console.log(this.claimList);
  }


constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to top
      }
    });
}

 private openErrorModal(messageData?: MessageModalData): void {
    this.dialogRef = this.dialogService.open(MessageModalComponent, {
      data: messageData,
      disableClose: true,
      ariaLabel: 'Error dialog'
    })
  }

goToSubmit(): void {
    this.router.navigate(['policy-claims-submission']);
  // Add your button click logic here
}

goToDetails(claimId: string): void {
    this.router.navigate(['claim-details',claimId]);
  // Add your button click logic here
}

  sortTable(sort: SortEvent): void {
      const { active, direction } = sort;
      
      if (!active || direction === null) return;
      
      this.claimList = [...(this.claimList || [])].sort((a, b) => {
        const aValue = this.getValueByPath(a, active);
        const bValue = this.getValueByPath(b, active);
        return this.compare(aValue, bValue, direction);
      });
    }

    private compare(a: any, b: any, direction: SortDirection): number {
      if (a == null) return direction === 'asc' ? -1 : 1;
      if (b == null) return direction === 'asc' ? 1 : -1;
      if (a < b) return direction === 'asc' ? -1 : 1;
      if (a > b) return direction === 'asc' ? 1 : -1;
      return 0;
    }
  
    private getValueByPath(obj: any, path: string): any {
      return path.split('.').reduce((acc, part) => acc?.[part], obj);
    }
}

