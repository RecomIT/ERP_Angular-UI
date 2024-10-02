
import { Byte } from "@angular/compiler/src/util";
export interface uploadCashSalaryHeads{
    cashSalaryHeadId: number,
    cashSalaryHeadName: string,  
    excelFile: File | null
}

export interface uploadCashSalary{
    uploadCashSalaryId: number,
    cashSalaryHeadName: string,  
    excelFile: File | null
}
