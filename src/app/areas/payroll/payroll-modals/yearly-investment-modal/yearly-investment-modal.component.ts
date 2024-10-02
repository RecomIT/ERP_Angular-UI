import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeYearlyInvestmentService } from "../../tax-module/employee-yearly-investment/employee-yearly-investment.service";
@Component({
    selector:'app-payroll-modal-yearly-investment',
    templateUrl:'./yearly-investment-modal.component.html'
})

export class YearlyInvestmentModalComponent implements OnInit {
    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('yearinvestmentmodal', { static: true }) yearinvestmentmodal!: ElementRef;

    constructor(private utilityService: UtilityService, private fb: FormBuilder,
        private userService: UserService, public modalService: CustomModalService, 
        private employeeYearlyInvestmentService: EmployeeYearlyInvestmentService) { }
    
    ngOnInit(): void {
        console.log("YearlyInvestmentModalComponent")
        this.openModal();
        this.saveFormInit();
    }

    saveForm: FormGroup;
    
    saveFormInit(){
        
        this.saveForm = this.fb.group({
            id: new FormControl(0),
            employeeId: new FormControl(this.User().EmployeeId),
            fiscalYearId: new FormControl(0),
            investmentAmount: new FormControl(0,[Validators.min(1)])
        })
    }

    User() {
        return this.userService.User();
    }

    openModal(){
        this.modalService.open(this.yearinvestmentmodal,'lg');
    }

    closeModal(reason:any){
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason)
    }
    btnSave: boolean= false;
    submit(){
        if(this.saveForm.valid){
            this.btnSave=true;
            this.employeeYearlyInvestmentService.saveEmployeeYearlyInvestment(this.saveForm.value).subscribe(response=>{
                console.log("response >>>", response);
                this.btnSave = false;
                if(response.body?.status){
                    this.utilityService.success(response.body?.msg,'Server Response')
                    this.closeModal('Save Successful')
                }
                else{
                    this.utilityService.success(response.body?.msg,'Server Response')
                }
            },error=>{
                this.btnSave = false;
                this.utilityService.fail('Something went wrong','Server Response');
            })
        }
        else{
            this.btnSave=false;
        }
    }

} 