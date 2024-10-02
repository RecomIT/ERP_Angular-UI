import { TestBed } from '@angular/core/testing';

import { ResignationCategoryService } from './resignation-category.service';

describe('ResignationCategoryService', () => {
  let service: ResignationCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResignationCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
