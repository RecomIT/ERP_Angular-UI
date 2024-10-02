import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePaginationComponent } from './leave-pagination.component';

describe('LeavePaginationComponent', () => {
  let component: LeavePaginationComponent;
  let fixture: ComponentFixture<LeavePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavePaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
