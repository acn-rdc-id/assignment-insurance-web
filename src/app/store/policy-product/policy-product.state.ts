import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PolicyStateModel } from './policy-product.state.model';
import { inject, Injectable } from '@angular/core';
import { PolicyDetails } from '../../models/policy-product.model';

@State<PolicyStateModel>({
  name: 'policyproductState',
  defaults: {
    policyDetails: [],
  },
})
@Injectable()
export class policyproductState {
  @Selector()
  static getPoliciesDetails(state: PolicyStateModel): PolicyDetails[] {
    return structuredClone(state.policyDetails);
  }
}
