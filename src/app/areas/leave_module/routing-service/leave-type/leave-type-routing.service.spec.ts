import { TestBed } from '@angular/core/testing';

import { LeaveTypeRoutingService } from './leave-type-routing.service';

describe('LeaveTypeRoutingService', () => {
  let service: LeaveTypeRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveTypeRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
