import { Component, OnInit } from "@angular/core";
import { LeaveTypeSerive } from "../leave-type.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { slideInUp } from "ng-animate";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector:'leave-module-leave-type-list',
    templateUrl:'./leave-type-list.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    ]
})

export class LeaveTypeListComponent implements OnInit{
    constructor(private leaveTypeSerive: LeaveTypeSerive, private utilityService:UtilityService){}
    ngOnInit(): void {
        this.loadData();
    }

    list: any[]=[];
    list_loading_label: string = null;

    loadData(){
        this.leaveTypeSerive.get({}).subscribe(response=>{
            this.list = response;
            this.list_loading_label = this.list.length > 0 ? "" : 'No records found';
        },(error)=>{
            console.log("error >>>", error);
            this.utilityService.fail("Something went wrong","Server Response");
        })
    }

    showInsertUpdateModal : boolean= false;
    leaveTypeId: number=0;
    showModal(id: any){
        this.showInsertUpdateModal = true;
        this.leaveTypeId=id;
    }

    closeModal(reason: any){
        this.showInsertUpdateModal = false;
        this.leaveTypeId=0;
        if(reason == 'Successfully Saved'){
            this.loadData();
        }
    }


}