import { TestBed } from '@angular/core/testing';

import { PolicyClaimService } from './policy-claim.service';

describe('PolicyClaimService', () => {
  let service: PolicyClaimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicyClaimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
