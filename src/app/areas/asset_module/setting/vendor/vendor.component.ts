import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { VendorSerive } from './vendor.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';


@Component({
  selector: 'asset-module-vendor',
  templateUrl: './vendor.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
 
})
export class VendorComponent implements OnInit {

  constructor(
    private vendorSerive: VendorSerive, 
    private utilityService:UtilityService) 
    { }

  ngOnInit(): void {
    this.loadData();
  }

  vendorId: number = 0;
  list: any[]=[];
  list_loading_label: string = null;

  loadData(){
      this.vendorSerive.get({}).subscribe(response=>{
        //console.log("loadData >>>", response.body);
          this.list = response.body;
          this.list_loading_label = this.list.length > 0 ? "" : 'No records found';
      },(error)=>{
          console.log("error >>>", error);
          this.utilityService.fail("Something went wrong","Server Response");
      })
  }

  showingModal : boolean= false;
  showModal(id: any){
      this.showingModal = true;
      this.vendorId=id;
  }

  closeModal(reason: any){
      this.showingModal = false;
      this.vendorId=0;
      if(reason == 'Successfully Saved'){
          this.loadData();
      }
  }


}
