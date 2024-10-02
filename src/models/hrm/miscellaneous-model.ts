export class bank {
    constructor(
        public bankId: number,
        public bankName: string,
        public bankCode: string,
        public isActive: boolean | null,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public organizationName: string,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class bankBranch {
    constructor(
        public bankBranchId: number,
        public bankBranchName: string,
        public routingNumber: string,
        public isActive: boolean,
        public bankId: number,
        public bankName: string,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public organizationName: string,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class bloodGroup {
    constructor(
        public bloodGroupId: number,
        public bloodGroupName: string,
        public organizationId: number,
        public organizationName: string,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class jobtype {
    constructor(
        public jobTypeId: number,
        public jobTypeName: string,
        public duration: string,
        public remarks: string,
        public organizationId: number,
        public organizationName: string,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class level {
    constructor(
        public levelId: number,
        public levelName: string,
        public remarks: string,
        public organizationId: number,
        public organizationName: string,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class jobStatus{
    constructor(
        public statusId: number,
        public jobStatusName: string,
        public remarks: string,
        public organizationId: number,
        public organizationName: string,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ){}
}

export class religion{
    constructor(
        public religionId: number,
        public religionName: string,
        public religionCode: string,
        public organizationId: number,
        public organizationName: string,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ){}
}