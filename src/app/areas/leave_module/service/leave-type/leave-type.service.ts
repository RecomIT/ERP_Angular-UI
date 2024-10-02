import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LeaveTypeRoutingService } from '../../routing-service/leave-type/leave-type-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {

  constructor(
    private leaveTypeRoutingService: LeaveTypeRoutingService,
    private notifyService: NotifyService
  ) { }

  private ddlLeaveTypesSource = new BehaviorSubject<any[]>([]);
  ddlLeaveTypes$ = this.ddlLeaveTypesSource.asObservable();


  loadLeaveTypes(params: any = {}): void {
    this.leaveTypeRoutingService.getSelect2LeaveType(params).subscribe(
      (data) => {
        this.ddlLeaveTypesSource.next(data);
        // console.log('ddlLeaveTypes:', data); 
      },
      (error) => {
        console.error('Error fetching leave types:', error);
        this.notifyService.handleApiError(error);
      }
    );
  }






  private ddlEncashableLeaveTypesSource = new BehaviorSubject<any[]>([]);
  ddlEncashableLeaveTypes$ = this.ddlEncashableLeaveTypesSource.asObservable();


  loadEncashableLeaveTypes(params: any = {}): void {
    this.leaveTypeRoutingService.getSelect2EncashableLeaveType(params).subscribe(
      (data) => {
        this.ddlEncashableLeaveTypesSource.next(data);
        // console.log('ddlEncashableLeaveTypes:', data); 
      },
      (error) => {
        console.error('Error fetching encashable leave types:', error);
        this.notifyService.handleApiError(error);
      }
    );
  }



}
