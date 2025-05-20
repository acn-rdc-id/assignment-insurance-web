import {Component, inject, OnInit} from '@angular/core';
import {
  NxHeaderCellDirective,
  NxSortDirective,
  NxSortHeaderComponent,
  NxTableCellComponent,
  NxTableComponent,
  NxTableRowComponent,
  SortDirection,
  SortEvent
} from '@aposin/ng-aquila/table';
import {NxTabComponent, NxTabGroupComponent} from '@aposin/ng-aquila/tabs';
import {NxBadgeComponent} from '@aposin/ng-aquila/badge';
import {Router} from '@angular/router';
import {DatePipe, NgClass} from '@angular/common';
import {NxColComponent} from '@aposin/ng-aquila/grid';
import {PolicyProductState} from '../../store/policy-product/policy-product.state';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-policy-servicing',
  imports: [
    NxTabGroupComponent,
    NxTabComponent,
    NxSortDirective,
    NxTableComponent,
    NxTableRowComponent,
    NxHeaderCellDirective,
    NxSortHeaderComponent,
    NxTableCellComponent,
    NxBadgeComponent,
    NgClass,
    DatePipe,
    NxColComponent
  ],
  templateUrl: './policy-servicing.component.html',
  styleUrl: './policy-servicing.component.scss'
})
export class PolicyServicingComponent implements OnInit {
  private store: Store = inject(Store);
  private router: Router = inject(Router);
  policyProduct: any;

  ngOnInit(): void {
    this.policyProduct = this.store.selectSnapshot(PolicyProductState.getPolicyDetailsList);
  }

  goToDetail(policyNo: string): void {
    this.router.navigate(['/policy-servicing-details', policyNo]);
  }

  sortTable(sort: SortEvent): void {
    const { active, direction } = sort;

    if (!active || direction === null) return;

    this.policyProduct = [...(this.policyProduct || [])].sort((a, b) => {
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
