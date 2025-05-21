import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NxColComponent, NxLayoutComponent, NxRowComponent,} from '@aposin/ng-aquila/grid';
import {NxLinkComponent} from '@aposin/ng-aquila/link';
import {Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {LoadAllPolicies} from '../../store/policy-product/policy-product.action';
import {PolicyProductState} from '../../store/policy-product/policy-product.state';
import {PolicyDetails} from '../../models/policy.model';
import {HttpErrorBody} from '../../models/http-body.model';
import {MessageModalData} from '../../models/message-modal-data.model';
import {MessageModalComponent} from '../message-modal/message-modal.component';
import {NxDialogService, NxModalRef} from '@aposin/ng-aquila/modal';
import {Subject} from 'rxjs';
import { ClaimListComponent } from '../claim-list/claim-list.component';

@Component({
  selector: 'app-policy-product',
  imports: [NxLayoutComponent, NxColComponent, NxRowComponent, NxLinkComponent,ClaimListComponent],
  templateUrl: './policy-product.component.html',
  styleUrl: './policy-product.component.scss',
})
export class PolicyProductComponent implements OnInit, OnDestroy {
  private router: Router = inject(Router);
  private store: Store = inject(Store);
  private dialogService = inject(NxDialogService);
  private unsubscribe$ = new Subject();
  numOfPolicy: number = 0;
  dialogRef?: NxModalRef<any>;

  ngOnInit() {
    this.store.dispatch(new LoadAllPolicies()).subscribe({
      complete: () => {
        const policyProduct: PolicyDetails[] = this.store.selectSnapshot(PolicyProductState.getPolicyDetailsList);
        this.numOfPolicy = policyProduct.length;
      },
      error: (err: HttpErrorBody) => {
        const messageData: MessageModalData = {
          header: 'Error',
          message: err.message ?? 'Unexpected error occurred.'
        };
        this.openErrorModal(messageData);
      }
    });
  }

  private openErrorModal(messageData?: MessageModalData): void {
    this.dialogRef = this.dialogService.open(MessageModalComponent, {
      data: messageData,
      disableClose: true,
      ariaLabel: 'Error dialog'
    })
  }

  goToUserPolicies(): void {
    this.router.navigate(['policy-servicing']);
  }

  goToInitialForm(): void {
    this.router.navigate(['policy-purchase']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('');
    this.unsubscribe$.complete();
  }
}
