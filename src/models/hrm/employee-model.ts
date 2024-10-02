import { baseModel } from "../base-model";

export class employeeOfficeInfo {
    constructor(
        public employeeId: number,
        public employeeCode: string,
        public fullName: string,
        public branchId: number,
        public divisionId: number,
        public gradeId: number,
        public designationId: number,
        public departmentId: number,
        public sectionId: number,
        public subSectionId: number,
        public divisionalHead: number,
        public headOfDepartment: number,
        public lineManager: number,
        public supervisor: number,
        public leadManagement: number,
        public hrAuthority: number,
        public gross: number,
        public basic: number,
        public houseRent: number,
        public medical: number,
        public conveyance: number,
        public dateOfJoining: Date | null,
        public dateOfConfirmation: Date | null,
        public serviceTenure: string,
        public jobStatusId: number,
        public officeMobile: string,
        public officeEmail: string,
        public referenceNo: string,
        public fingerID: string,
        public tinNo: string,
        public tinFile: File,
        public nidNo: string,
        public nidFile: File | null,
        public passportNo: string,
        public passportFile: File | null,
        public mobileAllowance: number,
        public jobLocationId: number,
        public workShiftId: number,

        public gradeName: string,
        public designationName: string,
        public departmentName: string,
        public divisionName: string,
        public branchName: string,
        public sectionName: string,
        public subSectionName: string,
        public jobStatusName: string,
        public jobLocationName: string,
        public divisionalHeadName: string,
        public headOfDepartmentName: string,
        public lineManagerName: string,
        public supervisorName: string,
        public leadManagementName: string,
        public hrAuthorityName: string,
        public stateStatus: string,
        public workShiftName: string,
        public unitId: number,
        public unitName: string,
        public lineId: number,
        public lineName: string,
        public gender: string,
        public jobTypeId: number,
        public jobType:string,
        public taxzone: string,
        public minimumTaxAmount: number
    ) { }
}

export class employeePesonalInfo {
    constructor(
        public employeeId: number,
        public bankName: string,
        public bankBranchName: string,
        public accountNo: string,
        public personalMobileNo: string,
        public personalEmailAddress: string,
        public dateOfBirth: Date | null,
        public bankId: number,
        public bankBranchId: number,
        public bloodGroupId: number,
        public religionId: number,
        public nationalityId: number,
        public feet: string,
        public inch: string,
        public gender: string,
        public bloodGroupName: string,
        public religionName: string,
        public nationalityName: string,
        public maritalStatus: string,
        public presentAddress: string,
        public permanentAddress: string,
        public fatherName: string,
        public motherName: string,
        public spouseName: string,
        public emergencyContactPerson: string,
        public relationWithEmergencyContactPerson: string,
        public emergencyContactNo: string,
        public emergencyContactAddress: string
    ) { }
}

export class employeeLevelOfEducation {
    constructor(
        public employeeEducationId: number,
        public employeeId: number,
        public employeeCode: string,
        public levelOfEducationId: number,
        public degreeId: number,
        public major: string,
        public institutionName: string,
        public result: string,
        public scaleDivisionClass: string,
        public yearOfPassing: string,
        public duration: string,
        public levelOfEducationName: string,
        public degreeName: string
    ) {
    }
}

export class employeeExperience {
    constructor(
        public employeeExperienceId: number,
        public employeeId: number,
        public employeeCode: string,
        public exCompanyname: string,
        public exCompanyBusinees: string,
        public exCompanyLocation: string,
        public exCompanyDepartment: string,
        public exCompanyDesignation: string,
        public exCompanyExperience: string,
        public employmentFrom: Date | null,
        public employmentTo: Date | null
    ) { }
}

export class employeeSkill {
    constructor(
        public employeeSkillId: number,
        public employeeId: number,
        public employeeCode: string,
        public trainingName: string,
        public organization: string,
        public location: string,
        public topicCovers: string,
        public fromDate: Date | null,
        public toDate: Date | null,
        public duration: string,
        public skillCertificateFilePath: string
    ) { }
}


export class employmentStageInfo {
    constructor(
        public employmentStageInfoId: number,
        public employeeId: number,
        public employeeName: string,
        public changeType: string,
        public flag: string,
        public remarks: string,
        public branchId: number,
        public branchName: string,
        public divisionId: number,
        public divisionName: string,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public organizationName: string,
        public totalHead: number,
        public stateStatus: string,
        public createdBy: string,
        public createdDate: Date | null,
        public approvedBy: string,
        public approvedDate: Date | null
    ) { }
}

export class employmentStageDetails{
    constructor(
        public changeableHeadId: number,
        public employeeId: number,
        public head: string,
        public existingValue: string,
        public existingText: string,
        public proposalValue: string,
        public proposalText: string,
        public isActive: boolean,
        public stateStatus: string,
        public effectiveDate:Date| null,
        public inActiveDate: Date| null,
        public activeDate: Date| null,
        public createdDate: Date |null
    ){}
}

export class employeePromotion{
    constructor(
        public employeePromotionalInfo: employmentStageInfo,
        public employeePromotionHeads: employmentStageDetails[]
    ){}
}

export interface employeeAccountInfo extends baseModel{
    accountInfoId:number;
    employeeId:number;
    gradeId:number | null,
    designationId:number | null,
    departmentId: number | null,
    bankId: number | null,
    bankBranchId: number | null,
    agentName: string,
    year: number,
    short: number,
    paymentMode: string,
    accountNo: string,
    isActive: boolean,
    isApproved: boolean,
    stateStatus: string,
    activationReason: string,
    remarks: string,
    effectiveFrom: string,
    deactivationFrom: string,
    employeeName: string,
    designationName: string,
    departmentName: string,
    gradeName: string,
    bankName: string,
    bankBranchName: string
}

export interface uploadPFActivationHeads{
    pfActivationId: number,
    employeeId: number,
    pfBasedAmount: string,
    pfPercentage: number,    
    pfEffectiveDate: Date | null,
    pfActivationDate: Date | null,
    remarks: string,
    excelFile: File | null
}

export interface uploadPromotionProposalHeads{
    promotionProposalId: number,
    employeeCode: string,
    head: string,
    proposalValue: string,    
    effectiveDate: Date | null,
    excelFile: File | null
}
export interface uploaTransferProposalHeads{
    transferProposalId: number,
    employeeCode: string,
    head: string,
    proposalValue: string,    
    effectiveDate: Date | null,
    excelFile: File | null
}
// Added by Monzur 29-Nov-2023
export interface uploadAccountInfoHeads{
    accountInfoId: number,
    employeeId: number,
    bankId: number,
    bankBranchId: number,
    agentName: string,
    paymentMode: string,
    accountNo: string,
    activationReason: string,
    excelFile: File | null
}
