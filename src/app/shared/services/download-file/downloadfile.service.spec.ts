import { TestBed } from '@angular/core/testing';

import { DownloadfileService } from './downloadfile.service';

describe('DownloadfileService', () => {
  let service: DownloadfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
