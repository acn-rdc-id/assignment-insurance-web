import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Store} from '@ngxs/store';
import { pipe, Subject, takeUntil } from 'rxjs';
import { HttpErrorBody } from '../../models/http-body.model';
import { GetClaimDetails } from '../../store/policy-claim/policy-claim.action';

@Component({
  selector: 'app-policy-claim-details',
  imports: [],
  templateUrl: './policy-claim-details.component.html',
  styleUrl: './policy-claim-details.component.scss'
})
export class PolicyClaimDetailsComponent implements OnInit, OnDestroy{

    private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: Store = inject(Store);
  private unsubscribe$ = new Subject();

  currentClaimId: number | undefined;

  loadSelectedClaim(): void {
      if (this.currentClaimId) {
        this.store.dispatch(new GetClaimDetails(this.currentClaimId)).subscribe({
          
        });
      }
    }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
          this.currentClaimId = parseInt(params.get('claimId') ?? '');
          console.log("Current Claim ID== ", this.currentClaimId)
          this.loadSelectedClaim();
        });
    
  }

  ngOnDestroy(): void {
    
  }

}
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {DownloadDocument, GetClaimDetails} from '../../store/policy-claim/policy-claim.action';
import {HttpErrorBody} from '../../models/http-body.model';

@Component({
  selector: 'app-policy-claim-details',
  imports: [],
  templateUrl: './policy-claim-details.component.html',
  styleUrl: './policy-claim-details.component.scss'
})
export class PolicyClaimDetailsComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private store: Store = inject(Store);

  private unsubscribe$ = new Subject();
  currentClaimId: number | undefined;

  loadSelectedClaimDetails() : void {
    if (this.currentClaimId) {
      this.store.dispatch(new GetClaimDetails(this.currentClaimId)).subscribe({
        next: () => {},
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
