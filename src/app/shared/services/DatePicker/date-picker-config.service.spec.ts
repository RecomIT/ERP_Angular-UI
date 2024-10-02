import { TestBed } from '@angular/core/testing';

import { DatePickerConfigService } from './date-picker-config.service';

describe('DatePickerConfigService', () => {
  let service: DatePickerConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatePickerConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
