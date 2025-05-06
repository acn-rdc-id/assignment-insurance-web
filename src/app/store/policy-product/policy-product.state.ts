import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { PolicyStateModel } from './policy-product.state.model';
import { inject, Injectable } from '@angular/core';
import { PolicyDetails } from '../../models/policy.model';
import { PolicyProductService } from '../../services/policy-product.service';
import { catchError, map, of, tap } from 'rxjs';
import { PolicyProductDetails } from './policy-product.action';

@State<PolicyStateModel>({
  name: 'PolicyProductState',
  defaults: {
    policyList: {
      quotationNumber: '',
      gender: '',
      dateOfBirth: '',
      age: 0,
    },
  },
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
            gender: res.data.gender,
            dateOfBirth: res.data.dateOfBirth,
            age: res.data.age,
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
