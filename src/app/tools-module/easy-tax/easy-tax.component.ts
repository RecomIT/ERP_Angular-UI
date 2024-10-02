import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ApiArea, ApiController, AppConstants } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Select2OptionData } from 'ng-select2';
import { OvertimePolicy } from 'src/models/payroll/overtime/overtime-policy';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import Stepper from 'bs-stepper';
import { EasyTax } from 'src/models/tools/easy-tax';

@Component({
  selector: 'app-easy-tax',
  templateUrl: './easy-tax.component.html',
  styleUrls: ['./easy-tax.component.css'],
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})

export class EasyTaxComponent implements OnInit {

  @ViewChild('easyTaxModal', { static: true }) easyTaxModal!: ElementRef;
  private stepper: Stepper;
  year: string = (new Date()).getFullYear().toString();
  policy : OvertimePolicy;
  easyTax : EasyTax;
  fieldsetDisabled : boolean = false;
  units : Array<Select2OptionData>;
  amountTypes : Array<Select2OptionData>; 
  genders : Array<Select2OptionData>; 
  regions : Array<Select2OptionData>; 

  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, private userService: UserService, private utilityService: UtilityService) { }
 
  ngOnInit(): void {
    this.policy =  new OvertimePolicy();
    this.easyTax = new EasyTax();
    
    this.units= [];

    this.amountTypes =[];

    this.genders =  
    [
      {id : 'Male' , text : 'Male'},
      {id : 'Female' , text : 'Female'},
      {id : 'Others' , text : 'Others'},
    ];

    this.regions =  
    [
      {id : 'Dhaka' , text : 'Dhaka City'},
      {id : 'Chittagong' , text : 'Chittagong City'},
      {id : 'Other City Corp.' , text : 'Other City Corp.'},
      {id : 'Outside City Corp.' , text : 'Outside City Corp.'},
    ];
  }

   // Modals Starts

  openEasyTaxyModal() {
    this.modalService.open(this.easyTaxModal, 'lg');
    this.stepper = new Stepper(document.querySelector('#easyTax-stepper'), {
      linear: false,
      animation: true,
  });
    //this.easyTax = new EasyTax();
  }

  // Functions Starts
  onGenderChange(){
    // console.log(this.easyTax.gender);
  }

  onRegionChange(){
    //console.log(this.easyTax.region);
  }
 
  onOverAgedChanged(){ 

    if (this.easyTax.overAged.toString() == AppConstants.True) {
      this.easyTax.overAged = true;
    } else {
      this.easyTax.overAged = false;
    }

    console.log('easyTax.overAged : ' + this.easyTax.overAged);
  }

  onPhysicallyChallengedChanged(){ 

    if (this.easyTax.physicallyChallenged.toString() == AppConstants.True) {
      this.easyTax.physicallyChallenged = true;
    } else {
      this.easyTax.physicallyChallenged = false;
    }

    //console.log('easyTax.physicallyChallenged : ' + this.easyTax.physicallyChallenged);
  }

  onFreedomFightersChanged(){ 

    if (this.easyTax.freedomFighters.toString() == AppConstants.True) {
      this.easyTax.freedomFighters = true;
    } else {
      this.easyTax.freedomFighters = false;
    }

    //console.log('easyTax.freedomFighters : ' + this.easyTax.freedomFighters);
  }

  onfreedomFightersChanged(){ 

    if (this.easyTax.freedomFighters.toString() == AppConstants.True) {
      this.easyTax.freedomFighters = true;
    } else {
      this.easyTax.freedomFighters = false;
    }

    //console.log('easyTax.freedomFighters : ' + this.easyTax.freedomFighters);
  }
  

next() {this.stepper.next();}

previous() { this.stepper.previous();}

onGrossIncomeChanged(){
  
    //console.log(this.easyTax.grossIncome);
    if(this.easyTax.grossIncome >= 0){

      this.easyTax.basic.amount = Math.round((this.easyTax.grossIncome * 0.5) * 100)/100;
      this.easyTax.houseRent.amount = Math.round((this.easyTax.grossIncome * 0.3)* 100)/100;
      this.easyTax.conveyance.amount = Math.round((this.easyTax.grossIncome * 0.1)* 100)/100;
      this.easyTax.medical.amount = Math.round((this.easyTax.grossIncome * 0.1)* 100)/100;
  }
  else
  {
      alert("Please input a valid positive amount for Gross Salary. For example: 65750.");
  }
}

  // Functions Ends

  easyTaxCalculationForm(form: NgForm) {

    //console.log(this.easyTax);
    // var request = this.areasHttpService.observable_post((ApiArea.tools + ApiController.EasyTax + "/TaxCard"), JSON.stringify(this.easyTax), 
    // { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} }); 

    var request = this.areasHttpService.observable_post((ApiArea.tools + ApiController.EasyTax + "/TaxCard"), this.easyTax, { responseType: 'blob' as 'json'}); 

    request.subscribe({
      next:(response)=>{
        if (response instanceof Blob) {
            if (response.size > 0) {
              this.utilityService.downloadFile(response, 'application/pdf', "EasyTax.pdf")
            }
            }
            else {
              this.utilityService.fail('No data available for report generation', "Server Response");
            }
      },
      error:(error)=>{
        this.utilityService.fail('Something went wrong', "Server Response");
      }
    })


    // request.subscribe((response) => {
    //   let result = response as any;
    //   console
    //   if (response instanceof Blob) {
    //     if (response.size > 0) {
    //       this.utilityService.downloadFile(response, 'application/pdf', "EasyTax.pdf")
    //     }
    //   }
    //   else {
    //     this.utilityService.fail('No data available for report generation', "Server Response");
    //   }

    //   // if (result?.status == 200) {
    //   //   this.utilityService.success(result.body.message, "Server Response")
    //   //   this.modalService.service.dismissAll("Save Complete");
        
    //   // }
    //   // else {
    //   //   this.utilityService.fail('Something went wrong', "Server Response")
    //   // }
    // },
    //   (error) => {
    //     if (error.havingValidationError) {
    //       Object.keys(error.validationErrors).forEach((propertyName: string) => {
    //         var errorMessages: string[] = error.validationErrors[propertyName];
    //         this.utilityService.fail(`Property : ${propertyName}` + ` ${errorMessages.join(' | ')}`, "Server Response")
    //       });
    //     }
    //     else {
    //       this.utilityService.fail(error.msg?.message, "Server Response")
    //     }
    //   }
    // )
  }

  //API Calls Ends

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

}
