import { TestBed } from '@angular/core/testing';

import { NoticePeriodService } from './notice-period.service';

describe('NoticePeriodService', () => {
  let service: NoticePeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoticePeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
