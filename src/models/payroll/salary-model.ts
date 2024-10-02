import { Byte } from "@angular/compiler/src/util";

export interface uploadSalaryHeads{
    salaryComponent: string,
    allowanceId: number,
    deductionId: number,
    salaryMonthAndYear: string,
    excelFile: File | null
} 
export interface uploadSalaryReviewHeads{
    salaryReviewInfoId: number,
    incrementReason: string,  
    effectiveFrom: Date | null,
    activationDate: Date | null,
    arrearCalculatedDate: Date | null,
    excelFile: File | null
}
