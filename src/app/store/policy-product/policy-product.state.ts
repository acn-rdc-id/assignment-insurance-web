import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  POLICY_PRODUCT_STATE_DEFAULT,
  PolicyStateModel,
} from './policy-product.state.model';
import { inject, Injectable } from '@angular/core';
import { PolicyDetails } from '../../models/policy.model';
import { PolicyProductService } from '../../services/policy-product.service';
import { catchError, map, of, tap } from 'rxjs';
import { PolicyProductDetails } from './policy-product.action';

@State<PolicyStateModel>({
  name: 'PolicyProductState',
  defaults: POLICY_PRODUCT_STATE_DEFAULT,
})
@Injectable()
export class PolicyProductState {
  private policyProductService = inject(PolicyProductService);
  private store = inject(Store);

  @Selector()
  static getPolicies(state: PolicyStateModel): PolicyDetails {
    return structuredClone(state.policyList);
  }

  @Action(PolicyProductDetails)
  getPolicyList({ setState }: StateContext<PolicyStateModel>) {
    return this.policyProductService.getPolicyDetails().pipe(
      tap((res) => {
        setState({
          policyList: {
            quotationNumber: res.data.quotationNumber,
            plan: res.data.plan,
            personalDetails: {
              gender: res.data.gender,
              dateOfBirth: res.data.dateOfBirth,
              age: res.data.age,
              title: res.data.title,
              fullName: res.data.fullName,
              nationality: res.data.nationality,
              idNo: res.data.idNo,
              otherId: res.data.otherId,
              isUsPerson: res.data.isUsPerson,
              countryOfBirth: res.data.countryOfBirth,
              isSmoker: res.data.isSmoker,
              cigarettesPerDay: res.data.cigarettesPerDay,
              countryCode: res.data.countryCode,
              mobileNo: res.data.mobileNo,
              occupation: res.data.occupation,
              email: res.data.email,
              transactionPurpose: res.data.transactionPurpose
            }
          },
        });
      }),
      catchError((e) => {
        console.error(e);
        return of();
      })
    );
  }
}
