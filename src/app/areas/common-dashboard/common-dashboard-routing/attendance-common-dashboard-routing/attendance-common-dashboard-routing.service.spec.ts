import { TestBed } from '@angular/core/testing';

import { AttendanceCommonDashboardRoutingService } from './attendance-common-dashboard-routing.service';

describe('AttendanceCommonDashboardRoutingService', () => {
  let service: AttendanceCommonDashboardRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceCommonDashboardRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
