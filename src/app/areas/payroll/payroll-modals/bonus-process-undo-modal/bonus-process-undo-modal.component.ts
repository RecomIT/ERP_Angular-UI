import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BonusProcessService } from "src/app/areas/payroll-services/bonus-process/bonus-process.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector:'app-payroll-bonus-undo-modal',
    templateUrl :'./bonus-process-undo-modal.component.html'
})

export class BonusProcessUndoModalComponent implements OnInit{
    @Input() data: any = {};
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('undoModal', { static: true }) undoModal!: ElementRef;

    constructor(private fb: FormBuilder, private bonusProcessService: BonusProcessService, private userService: UserService, public utilityService: UtilityService, public modalService: CustomModalService) {
    }

    ngOnInit(): void {
        this.undoFormInit();
    }

    undoForm: FormGroup;

    undoFormInit() {
        console.log("data from parent component >>>", this.data);
        this.undoForm = this.fb.group({
            bonusId: new FormControl(this.data?.bonusId??0,[Validators.min(1)]),
            bonusConfigId: new FormControl(this.data?.bonusConfigId??0),
            bonusProcessId: new FormControl(this.data?.bonusProcessId??0,[Validators.min(1)])
        })

        console.log("undoForm >>>", this.undoForm.value);
        this.openModal();
    }

    submit() {
        if(this.undoForm.valid){
            this.bonusProcessService.undoBonus(this.undoForm.value,null).subscribe(response=>{
                if(response?.status){
                    this.utilityService.success(response.msg,'Server Response');
                    this.closeModal('Save Complete');
                }
                else{
                    this.utilityService.fail(response.msg,'Server Response');
                }
            },(error)=>{
                this.utilityService.fail('Something went wrong','Server Response');
            })
        }
        else{
            this.utilityService.fail('Invalid Form Submission','Site Response');
        }
    }

    openModal() {
        this.modalService.open(this.undoModal, "lg");
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }
}