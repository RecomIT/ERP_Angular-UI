import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
  selector: 'app-salary-module-cash-salary-disbursed-modal',
  templateUrl: './cash-salary-disbursed-modal.component.html'
})
export class CashSalaryDisbursedModalComponent implements OnInit {
    @ViewChild('cashSalaryDisbursedModal', { static: true }) cashSalaryDisbursedModal!: ElementRef;
      @Output() closeModalEvent = new EventEmitter<string>();
  
      @Input() id: number = 0;
      @Input() list: any[] = [];
      processIdForChecking: any = 0;
      processObjChecking: any = null;
      constructor(private areasHttpService: AreasHttpService, private utilityService: UtilityService,
          private userService: UserService, public modalService: CustomModalService, private el: ElementRef) { }
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
          if (actionName != '') {
              if (confirm("Are you sure you want to " + actionName + "?")) {
                  this.btnProcess = true;
                  this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/CashSalary" + "/CashSalaryProcessDisbursedOrUndo"), null, {
                      params: { cashSalaryProcessId: this.id, actionName: actionName }
                  }).subscribe((result: any) => {
                      this.btnProcess = false;
                      if (result.status) {
                          this.utilityService.success(result.msg, "Server Response");
                          this.closeModal('Save Complete');
                      }
                      else {
                          this.utilityService.fail(result.msg, "Server Response")
                      }
                  }, (error) => {
                      this.btnProcess = false;
                      this.utilityService.fail("Something went wrong", "Server Response")
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
          this.processObjChecking = Object.assign({}, this.list.find(i => i.cashSalaryProcessId == this.id));
          this.modalService.open(this.cashSalaryDisbursedModal, "lg");
      }
  
      closeModal(reason: any){
          this.modalService.service.dismissAll(reason);
          this.closeModalEvent.emit(reason);
      }
  
  
  }
  