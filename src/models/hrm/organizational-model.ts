import { baseModel } from "../base-model";

export class department {
    constructor(
        public departmentId: number,
        public departmentName: string,
        public isActive: boolean | null,
        public remarks: string | null,
        public branchId: number,
        public branchName: string | null,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class deptZone {
    constructor(
        public deptZoneId: number,
        public zoneName: string,
        public isActive: boolean | null,
        public remarks: string | null,
        public departmentId: number,
        public departmentName: string,
        public branchId: number,
        public branchName: string | null,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class section {
    constructor(
        public sectionId: number,
        public sectionName: string,
        public isActive: boolean | null,
        public remarks: string | null,
        public deptZoneId: number,
        public zoneName: string,
        public branchId: number,
        public branchName: string | null,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class subsection {
    constructor(
        public subSectionId: number,
        public subSectionName: string,
        public isActive: boolean | null,
        public remarks: string | null,
        public sectionId: number,
        public sectionName: string,
        public branchId: number,
        public branchName: string | null,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class unit {
    constructor(
        public unitId: number,
        public unitName: string,
        public isActive: boolean | null,
        public remarks: string | null,
        public subSectionId: number,
        public subSectionName: string,
        public branchId: number,
        public branchName: string | null,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class grade {
    constructor(
        public gradeId: number,
        public gradeName: string,
        public gradeNameBangla: string,
        public remarks: string,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class designation{
    constructor(
        public designationId: number,
        public designationName: string,
        public shortName: string,
        public designationNameBangla: string,
        public lunchAllowance: number,
        public transportAllowance: number,
        public festivalBonus: number,
        public attendanceBonus: number,
        public otAllowance : number,
        public designationGroup: string,
        public salaryGroup: string,
        public remarks: string,
        public gradeId: number,
        public gradeName:string
    ){}
}

export interface leaveType extends baseModel {
    id: number,
    title: string,
    titleInBangali: string,
    shortName: string,
    shortNameInBangali: string,
    isActive: boolean,
}

export interface leaveSetting extends baseModel {
    leaveSettingId: number,
    leaveTypeId: number,
    leaveTypeName: string,
    shortName: string,
    noOfDays: number,
    noOfDaysBN: string,
    maxDaysLeaveAtATime: number,
    maxDaysLeaveAtATimeBN: string,
    isHolidayIncluded: boolean,
    isDayOffIncluded: boolean,
    isActive: boolean,
    remarks: string,
    stateStatus: string,
    effectiveFrom: Date | null,
    effectiveTo: Date | null

}

export interface line extends baseModel{
    lineId: number,
    lineName: string,
    lineNameInBengali: string,
    shortName: string,
    lineCode: string,
    isActive: boolean,
    remarks: string,
    departmentId: number,
    sectionId: number,
    branchId: number,
    departmentName: string,
    sectionName: string
}
export interface uploadInternalDesignationHeads{
    internalDesignationId: number,
    excelFile: File | null
}