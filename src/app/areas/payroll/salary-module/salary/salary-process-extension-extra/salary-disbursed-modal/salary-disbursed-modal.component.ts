import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SalaryProcessService } from "../salary-process.service";

@Component({
    selector: 'app-payroll-salary-disbursed-modal',
    templateUrl: './salary-disbursed-modal.component.html'
})

export class SalaryDisbursedModalComponent implements OnInit {

    @ViewChild('salaryProcessCheckingModal', { static: true }) salaryDisbursedModal!: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();

    @Input() id: number = 0;
    @Input() list: any[] = [];
    processIdForChecking: any = 0;
    processObjChecking: any = null;
    constructor(private areasHttpService: AreasHttpService, private utilityService: UtilityService,
        private userService: UserService, public modalService: CustomModalService, private el: ElementRef,private salaryProcessService: SalaryProcessService) { }
    ngOnInit(): void {
        this.openModal();
    }

    User() {
        return this.userService.User();
    }

    select2Options = this.utilityService.select2Config();
    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    btnProcess: boolean = false;
    submitSalaryProcessDisbursedOrUndo(actionName: any) {

        console.log(" salaryProcessId >>>", this.id);
        console.log(" actionName >>>", actionName);
        if (actionName != '') {
            if (confirm("Are you sure you want to " + actionName + "?")) {
                this.btnProcess = true;
                this.salaryProcessService.salaryProcessDisbursedOrUndo({ salaryProcessId: this.id, actionName: actionName }).subscribe(response=>{
                    this.btnProcess = false;
                    if (response.status) { 
                        this.utilityService.success(response.msg, "Server Response");
                        this.closeModal('Save Complete');
                    }
                    else {
                        this.utilityService.fail(response.msg, "Server Response")
                    }
                }, (error) => {
                    this.btnProcess = false;
                    this.utilityService.httpErrorHandler(error);
                })
            }
        }
        else {
            this.utilityService.fail("Invalid form value(s)", "Site Response", 3000);
        }
    }

    openModal(){
        this.processIdForChecking = this.id;
        this.processObjChecking = {};
        this.processObjChecking = Object.assign({}, this.list.find(i => i.salaryProcessId == this.id));
        this.modalService.open(this.salaryDisbursedModal, "lg");
    }

    closeModal(reason: any){
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}