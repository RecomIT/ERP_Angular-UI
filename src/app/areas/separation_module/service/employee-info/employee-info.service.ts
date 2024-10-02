import { Injectable } from '@angular/core';
import { UserRoutingService } from '../../routing-service/user/user-routing.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeInfoService {

  constructor(private userRoutingService: UserRoutingService) {}

  private employeeInfo: any;

  fetchEmployeeInfo(params: any): Observable<any[]> {
    return this.userRoutingService.getEmployeeInfoApi<any[]>(params).pipe(
      tap(employeeInfo => {
        this.employeeInfo = employeeInfo; 
      }),
      catchError(error => {
        console.error('Error fetching employee info:', error);
        return throwError('Failed to fetch employee info: ' + error.message);
      })
    );
  }

  getEmployeeInfo(params: any): Observable<any[]> {
    if (this.employeeInfo) {
      return of(this.employeeInfo); 
    } else {
      return this.fetchEmployeeInfo(params); 
    }
  }





  private employeeDetails: any;

  fetchEmployeeDetails(params: any): Observable<any[]> {
    return this.userRoutingService.getEmployeesDetailsAsync<any[]>(params).pipe(
      tap(employeeDetails => {
        this.employeeDetails = employeeDetails; 
      }),
      catchError(error => {
        console.error('Error fetching employee details:', error);
        return throwError('Failed to fetch employee details: ' + error.message);
      })
    );
  }

  getEmployeeDetails(params: any): Observable<any[]> {
    if (this.employeeDetails) {
      return of(this.employeeDetails); 
    } else {
      return this.fetchEmployeeDetails(params); 
    }
  }
}
