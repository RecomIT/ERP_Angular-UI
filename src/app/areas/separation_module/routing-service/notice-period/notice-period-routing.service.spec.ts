import { TestBed } from '@angular/core/testing';

import { NoticePeriodRoutingService } from './notice-period-routing.service';

describe('NoticePeriodRoutingService', () => {
  let service: NoticePeriodRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoticePeriodRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
