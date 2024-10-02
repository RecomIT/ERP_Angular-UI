import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectResignationRequestComponent } from './reject-resignation-request.component';

describe('RejectResignationRequestComponent', () => {
  let component: RejectResignationRequestComponent;
  let fixture: ComponentFixture<RejectResignationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectResignationRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectResignationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
