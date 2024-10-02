import { Component, OnInit } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UserService } from "src/app/shared/services/user.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Console } from "console";
import { WalletPaymentService } from "../../wallet-payment.service";

@Component({
  selector: 'app-salary-module-wallet-payment-configuration',
  templateUrl: './wallet-payment-configuration.component.html'
})
export class WalletPaymentConfigurationComponent implements OnInit {
    pageNumber: number = 1;
      pageSize: number = 15;
      pageConfig: any = this.userService.pageConfigInit("data_list", this.pageSize, 1, 0);
      datePickerConfig: Partial<BsDatepickerConfig> = {};
  
      constructor(private fb: FormBuilder,private userService: UserService,private utilityService: UtilityService, 
        private payrollWebService: PayrollWebService, public hrWebService: HrWebService,
        private walletService: WalletPaymentService,
        private datepipe: DatePipe) { }    
            
        ngOnInit(): void {
            this.formInit();
            this.getList();        
            this.loadInternalDesignations();
            this.datePickerConfig = this.utilityService.datePickerConfig();
        }
        select2Options = this.utilityService.select2Config();
        baseOfPayments: any = ["Flat", "Basic", "Gross"];
  
        activationDate: string = null; 
        deactivationDate: string = null;
      
        walletPaymentConfigForm: FormGroup;
        formInit(){
            this.walletPaymentConfigForm= this.fb.group({
                walletConfigId : new FormControl(0),
                internalDesignationId: new FormControl(0, Validators.min(1)),     
                internalDesignationName: new FormControl(''), 
                baseOfPayment: new FormControl(''), 
                walletFlatAmount: new FormControl(0),   
                walletTransferPercentage: new FormControl(0),   
                cocInWalletTransferPercentage: new FormControl(0),
                cocInWalletTransfer: new FormControl(0),     
                activationDate: new FormControl(this.activationDate),   
                deactivationDate: new FormControl(this.deactivationDate),             
                stateStatus : new FormControl(''),             
                isActive: new FormControl(true),    
                isApproved: new FormControl(false),    
                remarks : new FormControl(''),   
                sortingCol: new FormControl(''),
                sortType: new FormControl(''),
                pageNumber: new FormControl(this.pageNumber),
                pageSize: new FormControl(this.pageSize)        
            })
    
            this.walletPaymentConfigForm.valueChanges.subscribe(value=>{
                console.log("walletPaymentConfigForm values >>>",value);
                this.getList();
            })
        }
        
        
      activationDate_changed() {   
      this.walletPaymentConfigForm.get('activationDate').setValue(this.activationDate);   
      }
      deactivationDate_changed(){
        this.walletPaymentConfigForm.get('deactivationDate').setValue(this.deactivationDate);   
      }  
       
    
       ddlInternalDesignations: any[] = []
       loadInternalDesignations() {
            this.ddlInternalDesignations = [];       
            this.walletService.getInternalDesignations<any[]>().then((data) => {
                this.ddlInternalDesignations = data;
            })
        }
         
        list: any[] =[];
        getList(){
            let params = this.walletPaymentConfigForm.value;
            params.internalDesignationId = params.internalDesignationId =='null' || params.internalDesignationId == null? 0 : params.internalDesignationId;
            params.stateStatus = params.stateStatus =='null' || params.stateStatus == null? '' : params.stateStatus;
        
            this.walletService.getWalletConfigs(params).subscribe(response=>{             
                this.list=  response.body;               
                console.log(" this.list",  this.list);
                let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
                //console.log("xPaginate >>>",xPaginate);
                this.pageConfig = this.userService.pageConfigInit("data_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
                }, error=>{
                console.log(error)
            })
        }
    
        ddlStatus: any= this.utilityService.getDataStatus().filter(item=> item == "Pending" || item == "Approved" || item == "Rejected");
    
        page_Changed(event: any){
            this.pageNumber = event;
            this.walletPaymentConfigForm.get('pageNumber').setValue(this.pageNumber);
        }
    
        showWalletPaymentConfigInsertModal: boolean=false;
        openWalletPaymentConfigInsertModal(){
            this.showWalletPaymentConfigInsertModal = true;
        }
    
        closenWalletPaymentConfigInsertModal(reason: any){
            this.showWalletPaymentConfigInsertModal = false;
            if(reason =='Save Successful'){
                this.getList();
            }
        }
    
        walletConfigId: any = 0;
        editShowWalletPaymentConfigModal: boolean=false;
        openEditWalletPaymentConfigModal(id: any){
            this.walletConfigId = id;
            this.editShowWalletPaymentConfigModal = true;
          }
    
        closeEditWalletPaymentConfigModal(reason: any){
            this.editShowWalletPaymentConfigModal = false;
            this.walletConfigId = 0;
            if(reason =='Save Successful'){
                this.getList();
            }
        }
  
  }
  
