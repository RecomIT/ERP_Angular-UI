
export class country {
    constructor(
        public countryId: number,
        public countryName: string,
        public countryCode: string,
        public isoCode: string,
        public organizationId: number,
        public nationality:string,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}
export class division {
    constructor(
        public divisionId: number,
        public divisionName: string,
        public divisionCode: string,
        public countryId: number,
        public countryName: string,
        public organizationId: number,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class district {
    constructor(
        public districtId: number,
        public districtName: string,
        public districtCode: string,
        public divisionId: number,
        public divisionName: string,
        public countryId: number,
        public countryName: string,
        public organizationId: number,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class policeStation {
    constructor(
        public policeStationId: number,
        public policeStationName: string,
        public districtId: number,
        public districtName: string,
        public divisionId: number,
        public divisionName: string,
        public countryId: number,
        public countryName:string,
        public organizationId: number,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ) { }
}

export class location{
    constructor(
        public locationId: number,
        public locationName: string,
        public policeStationId: number,
        public policeStationName: string,
        public districtId: number,
        public districtName: string,
        public divisionId:number,
        public divisionName: string,
        public countryId: number,
        public countryName: string,
        public organizationId:number,
        public createdBy: string | null,
        public createdDate: null | Date,
        public updatedBy: string | null,
        public updatedDate: null | Date
    ){}
}
