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
  static getPolicies(state: PolicyStateModel): PolicyDetails[] {
    return structuredClone(state.policyList);
  }

  @Action(PolicyProductDetails)
  getPolicyList({ setState }: StateContext<PolicyStateModel>) {
    return this.policyProductService.getPolicyDetails().pipe(
      map((res) => {
        setState({
          policyList: res.data,
        });
      }),
      catchError((e) => {
        console.error(e);
        return of();
      })
    );
  }
}
