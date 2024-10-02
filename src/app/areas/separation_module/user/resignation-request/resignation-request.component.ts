
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resignation-request',
  templateUrl: './resignation-request.component.html',
  styleUrls: ['./resignation-request.component.css'],
})
export class ResignationRequestComponent implements OnInit {

  constructor() {      
  }

  ngOnInit(): void {
    this.setTitle();
  }

  showBackSection: boolean = true;
  showPlusSection: boolean = false;
  showListSection: boolean = false;
  

  showTitle: string;
  setTitle() {
    if (this.showBackSection) {
      this.showTitle = "Resignation Guidelines";
    } else if (this.showPlusSection) {
      this.showTitle = "New Resignation Request";
    } else if (this.showListSection) {
      this.showTitle = "Resignation Request List";
    } else {
      this.showTitle = ""; 
    }
  }


}
