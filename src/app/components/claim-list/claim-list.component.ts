import { Component, inject, Input, OnInit } from '@angular/core';
import {
  NxSortDirective,
  NxSortHeaderComponent,
  SortDirection,
  SortEvent,
} from '@aposin/ng-aquila/table';
import { NxColComponent } from '@aposin/ng-aquila/grid';
import { NavigationEnd, Router } from '@angular/router';
import { NxTabComponent, NxTabGroupComponent } from '@aposin/ng-aquila/tabs';
import { NxBadgeComponent } from '@aposin/ng-aquila/badge';
import { Store } from '@ngxs/store';
import { MessageModalData } from '../../models/message-modal-data.model';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import {
  ClearPolicySubmission,
  getClaimList,
} from '../../store/policy-claim/policy-claim.action';
import { PolicyClaimState } from '../../store/policy-claim/policy-claim.state';
import { PolicyClaim } from '../../models/policy-claim.model';
import { NxFormfieldComponent } from '@aposin/ng-aquila/formfield';
import { NxPaginationComponent } from '@aposin/ng-aquila/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-claim-list',
  imports: [
    NxColComponent,
    NxSortDirective,
    NxSortHeaderComponent,
    NxTabComponent,
    NxTabGroupComponent,
    FormsModule,
    NxBadgeComponent,
    NxFormfieldComponent,
    NxPaginationComponent,
  ],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss',
})
export class ClaimListComponent implements OnInit {
  claimList!: PolicyClaim[];
  private dialogService = inject(NxDialogService);
  dialogRef?: NxModalRef<any>;
  store: Store = inject(Store);
  router: Router = inject(Router);
  page: number = 1;
  filterValue: string = '';
  elementsPerPage: number = 7;

  policyClaimShownPageElements!: PolicyClaim[];
  policyClaimAvailableElements!: PolicyClaim[];

  ngOnInit(): void {
    this.store.dispatch(new ClearPolicySubmission());

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to top
      }
    });

    this.store.dispatch(new getClaimList()).subscribe({
      complete: () => {
        const claimList: PolicyClaim[] = this.store.selectSnapshot(
          PolicyClaimState.getClaimList
        );
        this.claimList = claimList;
        this.policyClaimAvailableElements = claimList;

        console.log('INITTTT->', this.policyClaimAvailableElements);
        this.updatePage();
      },
      error: (err) => {
        const messageData: MessageModalData = {
          header: 'Error',
          message: err.message ?? 'Unexpected error occurred.',
        };
        this.openErrorModal(messageData);
      },
    });
  }

  onFilterValueChange(value: string) {
    this.page = 1;
    this.filterData(value);
  }

  filterData(filterValue: string) {
    const filterRegexp = new RegExp(filterValue, 'i');

    this.policyClaimAvailableElements = this.claimList.filter((row) =>
      Object.values(row).some((value) => {
        let stringValue;

        if (typeof value === 'object' && value !== null) {
          stringValue = JSON.stringify(value);
        } else {
          stringValue = String(value);
        }

        return filterRegexp.test(stringValue);
      })
    );

    this.updatePage();
  }

  updatePage() {
    const indexMin = (this.page - 1) * this.elementsPerPage;
    const indexMax = indexMin + this.elementsPerPage;
    this.policyClaimShownPageElements =
      this.policyClaimAvailableElements.filter(
        (x, index) => index >= indexMin && index < indexMax
      );
  }

  // constructor(private router: Router) {
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       window.scrollTo(0, 0); // Scroll to top
  //     }
  //   });
  // }

  private openErrorModal(messageData?: MessageModalData): void {
    this.dialogRef = this.dialogService.open(MessageModalComponent, {
      data: messageData,
      disableClose: true,
      ariaLabel: 'Error dialog',
    });
  }

  goToSubmit(): void {
    this.store.dispatch(new ClearPolicySubmission());
    this.router.navigate(['policy-claims-submission']);
    // Add your button click logic here
  }

  goToDetails(claimId: string): void {
    this.router.navigate(['/policy-claim-details', claimId.toString()]);
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

  prevPage() {
    this.page--;
    this.updatePage();
  }

  nextPage() {
    this.page++;
    this.updatePage();
  }

  goToPage(n: number) {
    this.page = n;
    this.updatePage();
  }
}
