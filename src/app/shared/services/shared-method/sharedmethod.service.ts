import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedmethodService {

  constructor() { }

  private methodCallSource = new Subject<void>();
  methodCall$ = this.methodCallSource.asObservable();

  callMethod() {
    this.methodCallSource.next();
  }

}
