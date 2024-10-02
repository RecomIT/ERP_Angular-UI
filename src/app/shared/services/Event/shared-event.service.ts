import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedEventService {

  constructor() { }

// Using EventEmitter for explicit component communication
public submitSuccessEvent: EventEmitter<void> = new EventEmitter<void>();

// Using Subject for general-purpose event broadcasting
private notify = new Subject<any>();
notifyObservable$ = this.notify.asObservable();


public notifyOther(data: any): void {
  if (data) {
    this.notify.next(data);
  }
}




// ------------------------
private methodCallSource = new Subject<void>();
methodCall$ = this.methodCallSource.asObservable();

callMethod() {
  this.methodCallSource.next();
}



}
