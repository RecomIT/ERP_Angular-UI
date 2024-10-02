import { Guid } from "guid-typescript";

export class appUser {
    constructor(
        public id: Guid,
        public branchId: number,
        public divisionId: number,
        public companyId: number,
        public organizationId: number,
        public employeeId: number | null,
        public employeeCode:string,
        public fullName: string,
        public email: string,
        public address: string,
        public currentState: string,
        public userName: string,
        public isActive: boolean,
        public isRoleActive: boolean,
        public phoneNumber: string,
        public password: string,
        public confirmPassword: string,
        public roleId: string,
        public roleName: string,
        public profilePic: File | null,
        public createdBy: string,
        public createdDate: Date | null,
        public UpdatedBy: string,
        public UpdatedDate: Date | null,
        public branchName:string,
        public divisionName:string,
        public companyName:string,
        public organizationName:string,
        public defaultCode: string
    ) { }
}

export class appMainMenuForPermission {
    constructor(
        public mainmenuId: number,
        public mainmenuName: string,
        public moduleId: number,
        public appSubmenuForPermissions: appSubmenuForPermission[]
    ) { }
}

export class appSubmenuForPermission {
    constructor(
        public submenuId: number,
        public submenuName: string,
        public subSubmenuId: number,
        public subSubmenuName: string,
        public tabId: number,
        public tabName: string,
        public isSubmenuPermission: boolean,
        public isPageTabPermission: boolean,
        public hasParentSubmenu: boolean,
        public isAll:boolean,
        public isAdd: boolean,
        public isEdit: boolean,
        public isDetail: boolean,
        public isDelete: boolean,
        public isApproval: boolean,
        public isReport: boolean,
        public isUpload: boolean,
    ) { }
}

export class appUserData{
    constructor(
        public appUserInfo:appUser,
        public appUserMenuPermission:appMainMenuForPermission[]
    ){}
}

export interface tabPrivilege{
    tabName: string,
    tabAdd: boolean,
    tabEdit: boolean,
    tabDetail: boolean,
    tabDelete: boolean,
    tabApproval: boolean,
    tabReport: boolean,
    tabUpload: boolean
}

export interface componentPrivilege{
    submenuId: string,
    submenu: string,
    name: string,
    add: boolean,
    edit:boolean,
    detail: boolean,
    delete: boolean,
    approval: boolean,
    report: boolean,
    upload: boolean,
    tabPrivilege : tabPrivilege[]
}