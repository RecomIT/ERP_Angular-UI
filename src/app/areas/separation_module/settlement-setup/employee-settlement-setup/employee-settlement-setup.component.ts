import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';

@Component({
  selector: 'app-employee-settlement-setup',
  templateUrl: './employee-settlement-setup.component.html',
  styleUrls: ['./employee-settlement-setup.component.css'],
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
export class EmployeeSettlementSetupComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
    this.setTitle();
  }

  
  showPendingList: boolean = true;

  toggleEmployeeResignationRequest() {
    this.showPendingList = !this.showPendingList;
    this.setTitle();


  }


  
  showTitle: string;
  setTitle() {
   if (this.showPendingList) {
    this.showTitle = 'Pending Resignation Request'
   } else if (!this.showPendingList) {
     this.showTitle = "Resignation Request Setup List";
   } else {
     this.showTitle = ""; 
   }
 }
  

}
