import { Guid } from "guid-typescript";

export class AuthApp {
    constructor(
        public appId: number,
        public appName: string,
        public modules: AuthModule[]
    ) { }
}

export class AuthModule {
    constructor(
        public moduleId: number,
        public moduleName: string,
        public mainMenus: AuthMainmenu[]
    ) { }
}

export class AuthMainmenu {
    constructor(
        public mainMenuId: number,
        public mainMenuName: string,
        public hasPermision: boolean
    ) { }
}

export class Role {
    constructor(
        public id: Guid,
        public name: string,
        public isActive: boolean,
        public description: string,
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