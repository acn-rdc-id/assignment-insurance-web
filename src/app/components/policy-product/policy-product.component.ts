import { Component, inject, OnInit } from '@angular/core';
import {
  NxColComponent,
  NxLayoutComponent,
  NxRowComponent,
} from '@aposin/ng-aquila/grid';
import { NxLinkComponent } from '@aposin/ng-aquila/link';
import { PolicyDetails } from '../../models/policy-product.model';
import { Router } from '@angular/router';
import { ProgressbarComponent } from '../progress-bar/progressbar.component';
import { Store } from '@ngxs/store';
import { PolicyProductService } from '../../services/policy-product.service';
import { PolicyProductDetails } from '../../store/policy-product/policy-product.action';

@Component({
  selector: 'app-policy-product',
  imports: [
    NxLayoutComponent,
    NxColComponent,
    NxRowComponent,
    NxLinkComponent,
    ProgressbarComponent,
  ],
  templateUrl: './policy-product.component.html',
  styleUrl: './policy-product.component.scss',
})
export class PolicyProductComponent implements OnInit {
  numOfPolicy: number = 0;
  private router = inject(Router);
  private store = inject(Store);

  private policyProductService = inject(PolicyProductService);

  currentPath = 7;
  totalPath = 10;

  constructor(private apiService: PolicyProductService) {}
  responseData: PolicyDetails[] = [];

  ngOnInit(): void {
    this.apiService.getPolicyDetails().subscribe({
      next: (data) => {
        this.responseData = data;
        this.numOfPolicy = this.responseData.length;
        this.store.dispatch(new PolicyProductDetails(data)).subscribe();
      },
      error: (e) => {
        console.error(e);
        console.log('error');
      },
    });
  }

  goToUserPolicies() {
    // Navigate to User Policies List Page
    //this.router.navigate(['']);
  }

  goToInitialForm() {
    this.router.navigate(['policy-purchase']);
  }
}
