import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {DownloadDocument, GetClaimDetails} from '../../store/policy-claim/policy-claim.action';
import {HttpErrorBody} from '../../models/http-body.model';
import {NxColComponent} from '@aposin/ng-aquila/grid';
import { ClaimType, DocumentList, PolicyClaim, PolicyClaimDetails } from '../../models/policy-claim.model';
import { PolicyClaimState } from '../../store/policy-claim/policy-claim.state';
import { NxLinkComponent } from '@aposin/ng-aquila/link';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-policy-claim-details',
  imports: [
    NxColComponent,
    NxLinkComponent,
    RouterLink,
    CommonModule
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
          this.claimDetails = this.store.selectSnapshot (PolicyClaimState.getPolicyClaimDetails)

          console.log("Claim Details ==> ", this.claimDetails)

          this.claimType = this.claimDetails.claimType;

          this.claimDocument = this.claimDetails.documentList;
          console.log("line 42", this.claimDocument)
        },
        error: (err: HttpErrorBody) => {
        }
      });
    }
  }

  downloadDocument(): void {
    const payload = {
      keyName: "claim-policy/7e0eb95c-e9b0-4bb2-9f98-b038db9b972c_24_1/24_1_Diagnosis Report.txt"
    };

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
