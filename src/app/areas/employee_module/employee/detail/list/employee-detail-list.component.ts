import { Component,Input,OnInit } from "@angular/core";

@Component({
    selector: 'app-employee-module-employee-detail-list',
    templateUrl:'./employee-detail-list.component.html'
})

export class EmployeeDetailListComponent implements OnInit{
    @Input()  inputEmployeeId: any=0;
    employeeId:any=0;
    ngOnInit() {
        this.employeeId = this.inputEmployeeId;
    }
}