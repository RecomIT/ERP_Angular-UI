import { baseModel } from "../base-model";

export interface deductionHead {
    deductionHeadId: number,
    deductionHeadName: string,
    deductionHeadCode: string,
    deductionHeadNameInBengali: string,
    createdBy: string,
    createdDate: Date | null,
    updatedBy: string,
    updatedDate: Date | null,
    companyId: number,
    companyName: string,
    organizationId: number,
    organizationName: string
}

export interface deductionName {
    deductionNameId: number,
    name: string,
    glCode: string,
    deductionNameInBengali: string,
    deductionClientName: string,
    deductionClientNameInBengali: string,
    deductionDescription: string,
    deductionDescriptionInBengali: string,
    deductionType: string,
    isFixed: boolean,
    deductionHeadId: number,
    deductionHeadName: string,
    createdBy: string,
    createdDate: Date | null,
    updatedBy: string,
    updatedDate: Date | null,
    companyId: number,
    companyName: string,
    organizationId: number,
    organizationName: string
}
