
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
  })
export class AppToastr{
    constructor(public toastr:ToastrService) {
    }
    success(message:string, title:string, timeOut:number){
        this.toastr.success(message,title,{timeOut:timeOut})
    }
}