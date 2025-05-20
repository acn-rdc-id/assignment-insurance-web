import { TestBed } from '@angular/core/testing';

import { DeepCopyService } from './deep-copy.service';

describe('DeepCopyService', () => {
  let service: DeepCopyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeepCopyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
