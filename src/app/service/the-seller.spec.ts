import { TestBed } from '@angular/core/testing';

import { TheSeller } from './the-seller';

describe('TheSeller', () => {
  let service: TheSeller;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheSeller);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
