import { TestBed } from '@angular/core/testing';
import { PolicyProductService } from './policy-product.service';

describe('PolicyProductService', () => {
  let service: PolicyProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicyProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
