import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {DownloadDocument, GetClaimDetails} from '../../store/policy-claim/policy-claim.action';
import {HttpErrorBody} from '../../models/http-body.model';
import {NxColComponent} from '@aposin/ng-aquila/grid';
import {ClaimType, DocumentList, PolicyClaimDetails} from '../../models/policy-claim.model';
import {PolicyClaimState} from '../../store/policy-claim/policy-claim.state';
import {NxLinkComponent} from '@aposin/ng-aquila/link';
import {CommonModule} from '@angular/common';
import {NxTableCellComponent, NxTableComponent, NxTableRowComponent} from '@aposin/ng-aquila/table';

@Component({
  selector: 'app-policy-claim-details',
  imports: [
    NxColComponent,
    NxLinkComponent,
    CommonModule,
    NxTableComponent,
    NxTableRowComponent,
    NxTableCellComponent
  ],
  templateUrl: './policy-claim-details.component.html',
  styleUrl: './policy-claim-details.component.scss'
})
export class PolicyClaimDetailsComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private store: Store = inject(Store);

  private unsubscribe$ = new Subject();
  currentClaimId: number | undefined;
  claimDetails!: PolicyClaimDetails;
  claimType!: ClaimType;
  claimDocument!: DocumentList[];
  loadClaimsDetailsComplete: boolean = false;

  getStatusColor(status: string) {
    switch (status) {
      case 'Active':
        return { color: 'green', 'font-weight': 'bold' };
      case 'Inactive':
        return { color: 'red', 'font-weight': 'bold' };
      default:
        return { color: 'orange', 'font-weight': 'bold' };
    }
  }

  loadSelectedClaimDetails() : void {
    if (this.currentClaimId) {
      this.store.dispatch(new GetClaimDetails(this.currentClaimId)).subscribe({
        next: () => {
          this.claimDetails = this.store.selectSnapshot (PolicyClaimState.getPolicyClaimDetails);

          console.log("Claim Details ==> ", this.claimDetails);

          this.claimType = this.claimDetails.claimType;

          this.claimDocument = this.claimDetails.documentList;
          this.loadClaimsDetailsComplete = true;
          console.log("line 42", this.claimDocument);
        },
        error: (err: HttpErrorBody) => {
        }
      });
    }
  }

  downloadDocument(docUrl: string ): void {
    const payload = {
      keyName: docUrl
    };
    console.log("payload", payload);

    this.store.dispatch(new DownloadDocument(payload)).subscribe({
      error: (err: HttpErrorBody) => {
        console.error('Download failed', err);
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.currentClaimId = parseInt(params.get('claimId') ?? '');
    });

    this.loadSelectedClaimDetails();
  }
}
