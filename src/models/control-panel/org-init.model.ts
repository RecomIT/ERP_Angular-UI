import { Byte } from "@angular/compiler/src/util";

export class organization {
    constructor(
        public organizationId: number,
        public organizationName: string,
        public orgCode: string,
        public shortName: string,
        public address: string,
        public email: string,
        public phoneNumber: string,
        public mobileNumber: string,
        public website: string,
        public fax: string,
        public isActive: boolean,
        public contractStartDate: Date | null,
        public contractExpireDate: Date | null,
        public remarks: string,
        public orgPic: Byte[] | null,
        public orgBase64Pic: string | null,
        public orgImageFormat: string,
        public orgPicFile: File | null,
        public orgLogoPath: string,
        public reportPic: Byte[] | null,
        public reportBase64Pic: string | null,
        public reportImageFormat: string,
        public reportPicFile: File | null,
        public reportLogoPath: string,
        public appId: number,
        public appName: string,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class company {
    constructor(
        public companyId: number,
        public companyName: string,
        public companyCode: string,
        public address: string,
        public email: string,
        public phoneNumber: string,
        public mobileNumber: string,
        public fax: string,
        public website: string,
        public isActive: boolean,
        public contractExpireDate: Date | null,
        public remarks: string,
        public companyPic: Byte[] | null,
        public companyLogoPath: string,
        public companyImageFormat: string,
        public companyBase64Pic: string,
        public companyPicFile: File | null,
        public reportPic: Byte[] | null,
        public reportLogoPath: string,
        public reportImageFormat: string,
        public reportBase64Pic: string,
        public reportPicFile: File | null,
        public organizationId: number,
        public organizationName: string
    ) { }
}

export class division {
    constructor(
        public divisionId: number,
        public divisionName: string,
        public shortName: string,
        public divCode: string,
        public isActive: boolean,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public organizationName: string
    ) { }
}

export class district {
    constructor(
        public districtId: number,
        public districtName: string,
        public shortName: string,
        public disCode: string,
        public isActive: boolean,
        public divisionId: number,
        public divisionName: string,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public organizationName: string
    ) { }
}

export class zone {
    constructor(
        public zoneId: number,
        public zoneName: string,
        public shortName: string,
        public zoneCode: string,
        public isActive: boolean,
        public districtId: number,
        public districtName: string,
        public divisionId: number,
        public divisionName: string,
        public companyId: number,
        public companyName: string,
        public organizationId: number,
        public organizationName: string
    ) { }
}

export class branch {
    constructor(
        public branchId: number,
        public branchName: string,
        public shortName: string,
        public address: string,
        public mobileNo: string,
        public email: string,
        public branchCode: string,
        public phoneNo: string,
        public fax: string,
        public isActive: boolean,
        public remarks: string,
        public zoneId: 0,
        public zoneName: string,
        public districtId: 0,
        public districtName: string,
        public divisionId: 0,
        public divisionName: "",
        public companyId: 0,
        public companyName: "",
        public organizationId: 0,
        public organizationName: ""
    ) { }
}