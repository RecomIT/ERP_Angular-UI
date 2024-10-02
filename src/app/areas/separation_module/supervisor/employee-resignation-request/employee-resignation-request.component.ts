import { animate, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';

@Component({
  selector: 'app-employee-resignation-request',
  templateUrl: './employee-resignation-request.component.html',
  styleUrls: ['./employee-resignation-request.component.css'],
  animations: [
    trigger('flipInOut', [
      state('true', style({ transform: 'rotateY(0deg)' })),
      state('false', style({ transform: 'rotateY(180deg)' })),
      transition('true <=> false', animate('0.5s ease-in-out'))
    ]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),

    trigger('fadeInRight', [
      state('show', style({ opacity: 1, transform: 'translateX(0)' })),
      state('hide', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition('hide => show', animate('0.5s ease-in')),
      transition('show => hide', animate('0.5s ease-out'))
    ]),
  ],

})
export class EmployeeResignationRequestComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {

    this. setTitle();
  }


  showEmployeeResignationRequestList: boolean = false;

  toggleEmployeeResignationRequest() {
    this.showEmployeeResignationRequestList = !this.showEmployeeResignationRequestList;
    this.setTitle();

  }


  
  showTitle: string;
  setTitle() {
   if (this.showEmployeeResignationRequestList) {
    this.showTitle = 'Add New Resignation Request'
   } else if (!this.showEmployeeResignationRequestList) {
     this.showTitle = "Resignation Request List";
   } else {
     this.showTitle = ""; 
   }
 }
}
