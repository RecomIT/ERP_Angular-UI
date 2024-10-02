import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private employeeInfoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public employeeInfo$: Observable<any> = this.employeeInfoSubject.asObservable();

  constructor() { }

  setEmployeeInfo(employeeInfo: any) {
    this.employeeInfoSubject.next(employeeInfo);
  }

  getEmployeeInfo(): Observable<any> {
    return this.employeeInfoSubject.asObservable();
  }
  
}
