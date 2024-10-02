import { Component, Input, OnInit } from "@angular/core";


@Component({
    selector:'app-excel-view',
    templateUrl:'./excel-view.component.html'
})
export class ExcelViewComponent implements OnInit{
    @Input() excelColumn:any[] = null;
    @Input() excelJsonData:any[] = null;

    constructor(){

    }

    ngOnInit(): void {
        
    }
    
}