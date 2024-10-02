import { TestBed } from '@angular/core/testing';

import { SettlementSetupRoutingService } from './settlement-setup-routing.service';

describe('SettlementSetupRoutingService', () => {
  let service: SettlementSetupRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettlementSetupRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
