import { baseModel } from "../base-model";

export interface publicHoliday extends baseModel {
    publicHolidayId: number,
    title: string,
    titleInBengali: string,
    description: string,
    month: number,
    date: number,
    isDepandentOnMoon: boolean,
    religionId: number,
    religionName: string,
    stateStatus: string,
    isApproved: boolean,
    remarks: string,
    monthName: string,
    type: string
}

export interface YearlyHoliday {
    yearlyHolidayId: number,
    title: string,
    titleInBengali: string, 
    startMonth: number,
    startYear: number,
    startDate: Date | null,
    endMonth: number,
    endYear: number,
    endDate: Date | null,
    type: string,
    remarks: string,
    stateStatus: string,
    isApproved: boolean,
    specifiedFor: string,
    publicHolidayId:number | null,
    designationId: string,
    departmentId: string,
    sectionId: string,
    branchId: string,
    divisionId: string,
    userId: string,
    createdBy: string,
    createdDate: Date | null,
    updatedBy: string,
    updatedDate: Date | null,
    approvedBy: string,
    approvedDate: Date | null,
    checkedBy: string,
    checkedDate: Date | null,
    companyId: number,
    companyName: string,
    organizationId: number,
    organizationName: string,
    isDepandentOnMoon :boolean,

    //
    designationNames: string,
    designationlist: string[],
    departmentNames: string,
    departmentlist: string[],
    sectionNames: string,
    sectionlist: string[],
    unitNames: string,
    unitlist: string[],
    branchNames: string,
    branchlist: string[],
    divisionNames: string,
    divisionlist: string[]
}