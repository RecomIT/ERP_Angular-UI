import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leave-encashment-request',
  templateUrl: './leave-encashment-request.component.html',
  styleUrls: ['./leave-encashment-request.component.css']
})
export class LeaveEncashmentRequestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  
  // Encashment Request Modal

  showEncashmentRequestModal: boolean = false;

  openEncashmentRequestModal() {
    this.showEncashmentRequestModal = true;
  }

  closeEncashmentRequestModal(reason: any) {
    this.showEncashmentRequestModal = false;
  }



}
