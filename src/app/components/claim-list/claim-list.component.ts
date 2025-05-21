import { Component, inject, OnInit } from '@angular/core';
import { ClaimService } from '../../services/claim.service';
import { NxTableCellComponent, NxTableComponent } from '@aposin/ng-aquila/table';
import { NxColComponent } from '@aposin/ng-aquila/grid';

@Component({
  selector: 'app-claim-list',
  imports: [NxTableCellComponent,NxTableComponent,NxColComponent],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss'
})
export class ClaimListComponent implements OnInit {
  ClaimService : ClaimService = inject(ClaimService);
  try : any[] = []
  ngOnInit(): void {
  this.ClaimService.getClaimList().subscribe({
    next: (response: any): void => {
      this.try = response.data;
      console.log('Claim List:', this.try);
    },
    error: (error): void => {
      console.error('❌ API call failed:', error);
    }
  })
}

onButtonClick(): void {
  console.log('Button clicked!');
  // Add your button click logic here
}
}

