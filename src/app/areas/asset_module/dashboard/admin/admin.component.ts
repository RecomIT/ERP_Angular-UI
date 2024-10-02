import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ]
})
export class AdminComponent implements OnInit {

  constructor(
    public modalService: CustomModalService, 
    private utilityService: UtilityService, 
    private adminService: AdminService, 
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAssetCreationData();
    this.getAssetAssigningData();
    this.get();

  }

  navigateToApproval(value: string): void {
    this.router.navigate(['areas/asset/approval'], { queryParams: { data: value } });
    console.log('Received data:', value);
  }



  // list: any[] = [];
  list_loading_label: string = null;

  getCreationData: any[] = [];
  getAssigningData: any[] = [];

  getAssetCreationData() {
    this.adminService.getCreationData().subscribe(response => {
      this.getCreationData = response.body[0].AssetId;
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }

  getAssetAssigningData() {
    this.adminService.getAssigningData().subscribe(response => {
      if ((response.body).length > 0) {
        this.getAssigningData = response.body[0].AssetId;
      }

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }


  get() {
    // console.log("searchForm >>>", this.searchForm.value);
    this.adminService.get('').subscribe((response) => {
      this.list = response.body;
      this.list_loading_label = this.list.length > 0 ? "" : 'No records found';
      // console.log("list >>>", this.list);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

// =============

list = [
  {
    assetName: 'Asset 1',
    store: 'Store 1',
    vendor: 'Vendor 1',
    category: 'Category 1',
    subCategory: 'SubCategory 1',
    brand: 'Brand 1',
    totalQuantity: 100,
    assigningQuantity: 20,
    handoverQuantity: 10,
    replacementQuantity: 5,
    receivedQuantity: 15,
    servicingQuantity: 10,
    repairedQuantity: 5,
    balance: 35
  },
  // Add more items as needed
];


}
