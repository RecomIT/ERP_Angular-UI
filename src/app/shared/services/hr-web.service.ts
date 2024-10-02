import { Injectable } from '@angular/core';
import { promises } from 'dns';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea, ApiController } from '../constants';
import { UserService } from './user.service';
@Injectable({
    providedIn: 'root'
})
export class HrWebService {
    constructor(private areasHttpService: AreasHttpService, private userService: UserService) { }
    User() {
        return this.userService.User();
    }

    getGrades<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetGradesExtension"), {
            responseType: "json",
            // params: {
            //     companyId: this.User().ComId, organizationId: this.User().OrgId,
            // }
        });
    }

    getDesignations<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetDesignationExtension"), {
            responseType: "json",
            // params: {
            //     comId: this.User().ComId, orgId: this.User().OrgId,
            //     userId: this.User().UserId
            // }
        });
    }

    getDepartments<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetDepartmentExtension"),
            {
                responseType: "json",
                // params: {
                //     comId: this.User().ComId, orgId: this.User().OrgId,
                //     userId: this.User().UserId
                // }
            });
    }

    getSections<T>(departmentId: number = 0): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetSectionExtension"),
            {
                responseType: "json",
                params: {
                    departmentId: departmentId
                    // , comId: this.User().ComId, orgId: this.User().OrgId,
                    // userId: this.User().UserId
                }
            });
    }

    getSubSections<T>(sectionId: number = 0): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetSubsectionExtension"),
            {
                responseType: "json",
                params: {
                    sectionId: sectionId
                    // , comId: this.User().ComId, orgId: this.User().OrgId,
                    // userId: this.User().UserId
                }
            });
    }

    getBanks<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetBanksExtension"),
            {
                responseType: "json",
                // params: {
                //     comId: this.User().ComId, orgId: this.User().OrgId
                // }
            });
    }

    getBankBranches<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetBankBranchesExtension"),
            {
                responseType: "json",
                // params: {
                //     comId: this.User().ComId, orgId: this.User().OrgId
                // }
            });
    }

    getBankBranchesWithBankId<T>(bankId: number): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetBankBranchesExtensionWithBank"),
            {
                responseType: "json",
                params: {
                    bankId: bankId
                    // , comId: this.User().ComId, orgId: this.User().OrgId
                }
            });
    }

    getEmployees<T>(notEmployee: number = 0, designationId: number = 0, departmentId: number = 0, sectionId: number = 0, subsectionId: number = 0): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetEmployeeExtension"),
            {
                responseType: "json",
                params: {
                    notEmployee: notEmployee, designationId: designationId, departmentId: departmentId,
                    sectionId: sectionId, subsectionId: subsectionId
                }
            });
    }

    getEmployeeExtensionOne<T>(employeeId: number = 0, employeeIds: string = "", notEmployee: number = 0, designationId: number = 0, departmentId: number = 0, sectionId: number = 0, subsectionId: number = 0, branchId: number = 0): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetEmployeeExtensionOne"),
            {
                responseType: "json",
                params: {
                    employeeId: employeeId, employeeIds: employeeIds, notEmployee: notEmployee, designationId: designationId, departmentId: departmentId,
                    sectionId: sectionId, subsectionId: subsectionId
                    // , branchId: branchId,companyId: this.User().ComId, organizationId: this.User().OrgId
                }
            });
    }

    getWorkShift<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetWorkShiftExtension"),
            {
                responseType: "json",
                // params: {
                //     comId: this.User().ComId, orgId: this.User().OrgId
                // }
            });
    }

    getEmployeeSalaryBreakDowns<T>(employeeId: number): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.hrms + ApiController.employees + "/GetEmployeeSalaryBreakDowns"), {
            responseType: "json",
            params: {
                employeeId: employeeId
                //, companyId: this.User().ComId, organizationId: this.User().OrgId
            }
        });
    }

    getGetLeaveTypesExtension<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetLeaveTypesExtension"), {
            responseType: "json",
            // params: {
            //     companyId: this.User().ComId, organizationId: this.User().OrgId
            // }
        });
    }

    getEmployeeLeaveBalancesExtension<T>(employeeId: number): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetEmployeeLeaveBalancesExtension"), {
            responseType: "json",
            params: {
                employeeId: employeeId
                //, companyId: this.User().ComId, organizationId: this.User().OrgId
            }
        });
    }

    getDesignationExtension2<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetDesignationExtension2"), {
            responseType: "json"
        });
    }

    getReligions<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.hrms + ApiController.hr + "/GetReligions"), {
            responseType: "json",
            params: {
                religionId: 0, religionName: "",
                // OrgId: this.User().OrgId 
            }
        });
    }

    getJobTypes<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetJobTypesExtension"), {
            responseType: "json",
            //params: { organizationId: this.User().OrgId }
        });
    }

    getUnits<T>(subsectionId: number = 0): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetUnitExtension"), {
            responseType: "json",
            params: {
                subsectionId: subsectionId
                // , branchId: this.User().BranchId, companyId: this.User().ComId, organizationId: this.User().OrgId
            }
        });
    }

    getLines<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetLinesExtension"), {
            responseType: "json",
            //params: { companyId: this.User().ComId, organizationId: this.User().OrgId }
        });
    }

    getJobStatus<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.hrms + ApiController.hr + "/GetJobStatus"), {
            responseType: "json",
            params: {
                statusId: 0, jobStatusName: ""
                //, OrgId: this.User().OrgId, UserId: this.User().UserId
            }
        });
    }

    getReligionExtension<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetReligionExtension"), {
            responseType: "json",
            // params: { organizationId: this.User().OrgId }
        });
    }

    getEducationLevels<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetEducationLevels"), {
            responseType: "json",
            // params: { organizationId: this.User().OrgId }
        });
    }

    getEducationDegrees<T>(levelOfEducationId: number): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetEducationDegrees"), {
            responseType: "json",
             params: { levelOfEducationId: levelOfEducationId }
        });
    }

    getEmployeeShift<T>(date: any,employee_id: number): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetEmployeeShift"), {
            responseType: "json",
             params: { date: date,employeeId: employee_id}
        });
    }

    getProbationaryEmployees<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.hrService + "/GetProbationaryEmployees"), {
            responseType: "json"
        });
    }

    getLeavePeriod<T>(yearSearch: string = ""): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.hrms + ApiController.setup + "/GetLeavePeriod"),
            {
                responseType: "json",
                params: {
                    yearSearch: yearSearch
                }
            });
    }


}