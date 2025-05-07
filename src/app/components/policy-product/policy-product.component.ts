import { Component, inject, OnInit } from '@angular/core';
import {
  NxColComponent,
  NxLayoutComponent,
  NxRowComponent,
} from '@aposin/ng-aquila/grid';
import { NxLinkComponent } from '@aposin/ng-aquila/link';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { PolicyProductDetails } from '../../store/policy-product/policy-product.action';
import { PolicyProductState } from '../../store/policy-product/policy-product.state';

@Component({
  selector: 'app-policy-product',
  imports: [NxLayoutComponent, NxColComponent, NxRowComponent, NxLinkComponent],
  templateUrl: './policy-product.component.html',
  styleUrl: './policy-product.component.scss',
})
export class PolicyProductComponent implements OnInit {
  private router = inject(Router);
  private store = inject(Store);

  numOfPolicy: number = 0;

  constructor() {}

  ngOnInit() {
    this.store.dispatch(new PolicyProductDetails());

    const policyList = this.store.selectSnapshot(
      PolicyProductState.getPolicyDetailsList
    );

    this.numOfPolicy = policyList.length;
  }

  goToUserPolicies() {
    // Navigate to User Policies List Page
    //this.router.navigate(['']);
  }

  goToInitialForm() {
    this.router.navigate(['policy-purchase']);
  }
}
