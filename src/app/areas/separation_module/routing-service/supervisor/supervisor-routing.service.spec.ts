import { TestBed } from '@angular/core/testing';

import { SupervisorRoutingService } from './supervisor-routing.service';

describe('SupervisorRoutingService', () => {
  let service: SupervisorRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupervisorRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
