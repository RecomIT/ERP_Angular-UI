import { TestBed } from '@angular/core/testing';

import { ServiceLengthService } from './service-length.service';

describe('ServiceLengthService', () => {
  let service: ServiceLengthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceLengthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
