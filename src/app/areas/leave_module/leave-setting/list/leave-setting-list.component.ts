import { Component, OnInit } from "@angular/core";
import { LeaveSettingSerive } from "../leave-setting.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { slideInUp } from "ng-animate";
@Component({
    selector:'leave-module-leave-setting-list',
    templateUrl:'./leave-setting-list.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    ]
})

export class LeaveSettingListComponent implements OnInit {
    constructor(private leaveSettingSerive: LeaveSettingSerive, private utilityService:UtilityService){}
    ngOnInit(): void {
        this.loadData();
    }

    
    list: any[]=[];
    list_loading_label: string = null;

    loadData(){
        this.leaveSettingSerive.get({}).subscribe(response=>{
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