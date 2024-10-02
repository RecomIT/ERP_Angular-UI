import { baseModel } from "../base-model";

export interface allowanceHead {
    allowanceHeadId: number,
    allowanceHeadName: string,
    allowanceHeadCode: string,
    allowanceHeadNameInBengali: string,
    createdBy: string,
    createdDate: Date | null,
    updatedBy: string,
    updatedDate: Date | null,
    companyId: number,
    companyName: string,
    organizationId: number,
    organizationName: string
}

export interface allowanceName {
    allowanceNameId: number,
    name: string,
    glCode: string,
    allowanceNameInBengali: string,
    allowanceClientName: string,
    allowanceClientNameInBengali: string,
    allowanceDescription: string,
    allowanceDescriptionInBengali: string,
    allowanceType: string,
    isFixed: boolean,
    allowanceHeadId: number,
    allowanceHeadName: string,
    createdBy: string,
    createdDate: Date | null,
    updatedBy: string,
    updatedDate: Date | null,
    companyId: number,
    companyName: string,
    organizationId: number,
    organizationName: string
}

export interface salaryAllowanceConfiguration extends baseModel{
    salaryAllowanceConfigId: number,
    configCategory: string,
    employeeId:number,
    allowanceBase: string,
    allowanceNameId: number,
    allowanceName: string,
    percentage: number,
    amount: number,
    isPeriodically: boolean,
    isFixedSalaryHead: boolean,
    maxAmount: number | null,
    minAmount: number | null,
    additionalAmount: number | null,
    effectiveFrom: Date | null,
    effectiveTo: Date | null,
    stateStatus: string,
    salaryAllowanceConfigDetailId: number
    
}

export interface salaryAllowanceConfigurationInfo extends baseModel{
    salaryAllowanceConfigId: number,
    configCategory: string,
    isActive: boolean,
    stateStatus: string,
    headCount: number,
    salaryAllowanceConfigurationDetails: salaryAllowanceConfigurationDetail[]
}

export interface salaryAllowanceConfigurationDetail extends baseModel{
    salaryAllowanceConfigDetailId: number,
    allowanceBase: string,
    allowanceNameId: number,
    allowanceName: string,
    employeeId: number | null,
    gradeId: number | null,
    designationId: number | null,
    percentage: number | null,
    amount: number | null,
    maxAmount: number | null,
    minAmount: number | null,
    additionalAmount: number | null,
    isPeriodically: boolean,
    effectiveFrom: Date | null,
    effectiveTo: Date | null,
    salaryAllowanceConfigId: number
}

export interface salaryReviewInfo extends baseModel{
    salaryReviewInfoId: number,
    employeeId: number,
    designationId: number | null,
    internalDesignationId: number | null,
    departmentId: number | null,
    sectionId: number | null,
    branchId: number | null,
    currentSalaryAmount: number | null,
    salaryBaseAmount : number | null,
    previousSalaryAmount: number | null,
    salaryAllowanceConfigId: number| null
    salaryConfigCategory: string,
    incrementReason : string,
    description: string,
    stateStatus: string,
    isActive: boolean,
    remarks: string,
    effectiveFrom: Date | null,
    effectiveTo: Date | null,
    activationDate: Date | null,
    deactivationDate: Date| null,
    isArrearCalculated: boolean,
    arrearCalculatedDate: Date | null,
    employeeCode: string,
    fullName: string,
    designationName: string,
    internalDesignationName: string,
    departmentName: string,
    sectionName: string,
    branchName: string,
    isAutoCalculate: boolean,
    baseType: string,
    salaryReviewDetails: salaryReviewDetail[]
}

export interface salaryReviewDetail extends baseModel{
    salaryReviewDetailId: number,
    allowanceNameId: null,
    allowanceName: string,
    salaryAllowanceConfigDetailId: number | null,
    allowanceBase: string,
    allowancePercentage: number | null,
    allowanceAmount: number,
    currentAmount: number,
    previousAmount: number,
    salaryReviewInfoId: number,
    allowanceHeadId: number,
    allowanceHeadName: string,
    salaryConfigCategoryInfoId: number| null,
    salaryConfigCategory: string,
    maxAmount: number | null,
    minAmount: number | null,
    allowanceFlag: string,
    additionalAmount: number | null
}