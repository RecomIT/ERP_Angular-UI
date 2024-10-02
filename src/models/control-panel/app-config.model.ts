export class application {
    constructor(
        public applicationId: number,
        public applicationName: string,
        public applicationType: string,
        public isActive: boolean,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class appModule {
    constructor(
        public moduleId: number,
        public moduleName: string,
        public applicationId: number,
        public applicationName: string,
        public isActive: boolean,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class mainmenu {
    constructor(
        public mmId: number,
        public menuName: string,
        public shortName: string | null,
        public iconClass: string | null,
        public iconColor: string | null,
        public mId: number,
        public moduleName: string,
        public applicationId: number,
        public applicationName: string,
        public isActive: boolean,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date,
        public sequenceNo : null | number
    ) { }
}

export class submenu {
    constructor(
        public submenuId: number,
        public submenuName: string,
        public controllerName: string | null,
        public actionName: string | null,
        public path: string | null,
        public component: string | null,
        public iconClass: string | null,
        public iconColor: string | null,
        public isViewable: boolean,
        public isActAsParent: boolean,
        public hasTab: boolean,
        public isActive: boolean,
        public parentSubmenuId: number,
        public mmId: number,
        public menuName: string | null,
        public moduleId: number,
        public moduleName: string | null,
        public applicationId: number,
        public applicationName: string | null,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date,
        public menuSequence : null | number
    ) { }
}

export class pageTab {
    constructor(
        public tabId: number,
        public tabName: string,
        public iconClass: string | null,
        public iconColor: string | null,
        public isActive: boolean,
        public submenuId: number,
        public submenuName: string,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}
