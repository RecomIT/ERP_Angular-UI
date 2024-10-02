import { TestBed } from '@angular/core/testing';

import { ResignationRequestRoutingService } from './resignation-request-routing.service';

describe('ResignationRequestRoutingService', () => {
  let service: ResignationRequestRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResignationRequestRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
