import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CategoryService } from './category.service';
import { BrandService } from './brand-modal/brand.service';
import { SubCategoryService } from './sub-category-modal/subCategory.service';



@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class CategoryComponent implements OnInit {

  constructor(
    private utilityService: UtilityService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private subCategoryService: SubCategoryService
  ) { }

  ngOnInit(): void {
    this.getCategoryList();
    this.getSubCategoryList();
    this.getBrandList();
  }

  list_loading_label: string = null;
  itemId: number = 0;


  categoryList: any[] = [];
  getCategoryList() {
    this.categoryService.getCategory({}).subscribe((response) => {
      this.categoryList = response.body;
      this.list_loading_label = this.categoryList.length > 0 ? "" : 'No records found';
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  subCategoryList: any[] = [];
  getSubCategoryList() {
    this.subCategoryService.getSubCategory({}).subscribe((response) => {
      //console.log("subCategoryList >>>", response.body);
      this.subCategoryList = response.body;
      this.list_loading_label = this.subCategoryList.length > 0 ? "" : 'No records found';
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  brandList: any[] = [];
  getBrandList() {
    this.brandService.getBrand({}).subscribe((response) => {
      this.brandList = response.body;
      this.list_loading_label = this.brandList.length > 0 ? "" : 'No records found';
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }


  showingCategoryModal: boolean = false;
  showCategoryModal(id: number) {
    //console.log("id >>>", id);
    this.showingCategoryModal = true;
    this.itemId = id;
  }

  closeCategoryModal(reason: any) {
    this.showingCategoryModal = false;
    this.itemId = 0;
    if (this.utilityService.SuccessfullySaved) {
      this.getCategoryList();
    }
  }


  showingSubCategoryModal: boolean = false;
  showSubCategoryModal(id: number) {
    //console.log("id >>>", id);
    this.showingSubCategoryModal = true;
    this.itemId = id;
  }

  closeSubModal(reason: any) {
    this.showingSubCategoryModal = false;
    this.itemId = 0;
    if (this.utilityService.SuccessfullySaved) {
      this.getSubCategoryList();
    }
  }

  showingBrandModal: boolean = false;
  showBrandModal(id: number) {
    //console.log("id >>>", id);
    this.showingBrandModal = true;
    this.itemId = id;
  }


  closeBrandModal(reason: any) {
    this.showingBrandModal = false;
    this.itemId = 0;
    if (this.utilityService.SuccessfullySaved) {
      this.getBrandList();
    }
  }

}




