import {Component, Inject, inject, LOCALE_ID} from '@angular/core';
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
import {PolicyDetails} from '../../models/policy.model';
import {NxFormfieldComponent} from '@aposin/ng-aquila/formfield';
import {FormsModule} from '@angular/forms';
import {NxPaginationComponent} from '@aposin/ng-aquila/pagination';
import {NxInputDirective} from '@aposin/ng-aquila/input';

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
    NxColComponent,
    NxFormfieldComponent,
    FormsModule,
    NxPaginationComponent,
    NxInputDirective,
  ],
  templateUrl: './policy-servicing.component.html',
  styleUrl: './policy-servicing.component.scss'
})
export class PolicyServicingComponent {
  private store: Store = inject(Store);
  private router: Router = inject(Router);

  policyProduct: Array<PolicyDetails> = [];

  policyProductShownPageElements!: PolicyDetails[];
  policyProductAvailableElements: PolicyDetails[];

  page: number = 1;
  filterValue: string = '';
  elementsPerPage: number = 7;

  constructor(@Inject(LOCALE_ID) private readonly localeId: string) {
    this.policyProduct = this.store.selectSnapshot(PolicyProductState.getPolicyDetailsList);

    this.policyProductAvailableElements = this.policyProduct;

    this.updatePage();
  }

  goToDetail(policyId: number): void {
    this.router.navigate(['/policy-servicing-details', policyId.toString()]);
  }

  sortTable(sort: SortEvent): void {
    const { active, direction } = sort;

    if (!active || direction === null) return;

    this.policyProductAvailableElements = [...(this.policyProductAvailableElements || [])].sort((a, b) => {
      const aValue = this.getValueByPath(a, active);
      const bValue = this.getValueByPath(b, active);
      return this.compare(aValue, bValue, direction);
    });

    this.updatePage();
  }

  private compare(a: any, b: any, direction: SortDirection): number {
    if (a == null) return direction === 'asc' ? -1 : 1;
    if (b == null) return direction === 'asc' ? 1 : -1;
    if (a < b) return direction === 'asc' ? -1 : 1;
    if (a > b) return direction === 'asc' ? 1 : -1;
    return 0;
  }

  onFilterValueChange(value: string) {
    this.page = 1;
    this.filterData(value);
  }

  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  filterData(filterValue: string) {
    const filterRegexp = new RegExp(filterValue, 'i');

    this.policyProductAvailableElements = this.policyProduct.filter(row =>
      Object.values(row).some(value => {
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
    this.policyProductShownPageElements =
      this.policyProductAvailableElements.filter(
        (x, index) => index >= indexMin && index < indexMax,
      );
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
