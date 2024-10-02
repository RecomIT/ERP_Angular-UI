import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea, ApiController } from '../constants';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})

export class ControlPanelWebService {
    constructor(private areasHttpService: AreasHttpService, private userService: UserService) { }
    User() {
        return this.userService.User();
    }

    GetOrganization<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.controlPanelService + "/GetOrganizationExtension"), {
            responseType: "json",
        });
    }

    GetCompany<T>(orgId: number = 0): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.controlPanelService + "/GetCompanyExtension"), {
            responseType: "json",
            params: {
                orgId: orgId
            }
        });
    }

    GetUserRoles<T>(orgId: number, comId: number = 0): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.controlPanelService + "/GetUserRoles"), {
            responseType: "json",
            params: {
                orgId: orgId,
                comId: comId
            }
        });
    }

    GetCompanyAuthMainmenu<T>(comId: number = 0): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.controlPanelService + "/GetCompanyAuthMainmenuExtension"), {
            responseType: "json",
            params: {
                comId: comId
            }
        });
    }

    getBranchExtension<T>(flag: any): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.controlPanelService + "/GetBranchExtension"), {
            responseType: "json",
            params: {
                flag: flag, ComId: this.User().ComId, OrgId: this.User().OrgId,
            }
        });
    }

    getPayrollModuleConfig<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.controlPanelService + "/GetPayrollModuleConfig"), {
            responseType: "json"
        });
    }

    getCheckUserprivilege<T>(component: string): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.controlpanel + "/access" + "/CheckUserprivilege"), {
            responseType: "json",
            params: {
                userId: this.User().UserId,component:component ,companyId: this.User().ComId, organizationId: this.User().OrgId,
            }
        });
    }

    getCheckUserprivilegeObs<T>(component: string): Observable<T> {
        return this.areasHttpService.observable_get<T>((ApiArea.controlpanel + "/access" + "/CheckUserprivilege"), {
            responseType: "json",
            params: {
                userId: this.User().UserId,component:component ,companyId: this.User().ComId, organizationId: this.User().OrgId,
            }
        });
    }

    Userprivilege: any;

    hasPagePermission(component: string): any{
       //return this.getCheckUserprivilege<any>(component);
         this.getCheckUserprivilegeObs<any>(component).pipe(map(data=>{ return this.Userprivilege = data}))
    }

}