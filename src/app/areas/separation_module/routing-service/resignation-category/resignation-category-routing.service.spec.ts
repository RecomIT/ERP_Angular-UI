import { TestBed } from '@angular/core/testing';

import { ResignationCategoryRoutingService } from './resignation-category-routing.service';

describe('ResignationCategoryRoutingService', () => {
  let service: ResignationCategoryRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResignationCategoryRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
