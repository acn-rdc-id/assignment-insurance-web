import { Component, inject, OnInit } from '@angular/core';
import {
  NxColComponent,
  NxLayoutComponent,
  NxRowComponent,
} from '@aposin/ng-aquila/grid';
import { NxLinkComponent } from '@aposin/ng-aquila/link';
import { ApiService } from '../../services/api/api.service';
import { PolicyDetails } from '../../models/policy-product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy-product',
  imports: [NxLayoutComponent, NxColComponent, NxRowComponent, NxLinkComponent],
  templateUrl: './policy-product.component.html',
  styleUrl: './policy-product.component.scss',
})
export class PolicyProductComponent implements OnInit {
  numOfPolicy: number = 0;
  private router = inject(Router);

  constructor(private apiService: ApiService) {}
  responseData: PolicyDetails[] = [];

  ngOnInit(): void {
    this.apiService.getPolicyDetails().subscribe({
      next: (data) => {
        this.responseData = data;
        this.numOfPolicy = this.responseData.length;
        // console.log(this.responseData.length);
      },
      error: (e) => {
        console.error(e);
        console.log('error');
      },
      // complete: () => console.log('complete'),
    });
  }

  goToUserPolicies() {
    console.log('Navigate to User Policies List Page');
    // Navigate to User Policies List Page
    //this.router.navigate(['']);
  }

  goToInitialForm() {
    console.log('Navigate to Initial Form Page');
    // Navigate to Initial Form Page
    //this.router.navigate(['']);
  }
}
